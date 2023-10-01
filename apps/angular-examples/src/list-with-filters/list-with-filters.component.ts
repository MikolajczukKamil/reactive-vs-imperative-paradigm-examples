import { AsyncPipe, JsonPipe, NgIf } from '@angular/common'
import { Component, inject }         from '@angular/core'
import { FormsModule }               from '@angular/forms'
import { MatButtonModule }           from '@angular/material/button'
import { MatCardModule }             from '@angular/material/card'
import { MatIconModule }             from '@angular/material/icon'
import { MatInputModule }            from '@angular/material/input'
import { MatProgressBarModule }      from '@angular/material/progress-bar'
import { MatSelectModule }           from '@angular/material/select'
import { MatSortModule, Sort }       from '@angular/material/sort'
import { MatTableModule }            from '@angular/material/table'
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  Observable,
  retry,
  startWith,
  Subject,
  switchMap,
  tap, throttleTime,
} from 'rxjs'

import { Etf, EtfService } from './etfs'


interface Ctx {
  loading: boolean
  error: boolean
  data: Etf[] | null
}

export class DeclarativeSubject<Value> extends BehaviorSubject<Value> {
  override set value(rawValue: Value) {
    this.next(rawValue)
  }
  
  override get value(): Value {
    return this.getValue()
  }
}

@Component({
  standalone: true,
  imports: [
    MatTableModule,
    AsyncPipe,
    NgIf,
    MatProgressBarModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatSortModule,
    FormsModule,
    JsonPipe,
    MatButtonModule,
  ],
  selector: 'list-with-filters',
  templateUrl: './list-with-filters.component.html',
  styleUrls: [ './list-with-filters.component.scss' ],
})
export class ListWithFiltersComponent {
  private readonly etfs = inject(EtfService)
  
  protected readonly loading$ = new DeclarativeSubject(false)
  protected readonly error$ = new DeclarativeSubject(false)
  protected readonly sort$ = new DeclarativeSubject<Sort | null>(null)
  
  protected readonly page$ = new DeclarativeSubject<number>(1)
  protected readonly pageSize$ = new DeclarativeSubject<number>(25)
  
  protected readonly search$ = new DeclarativeSubject<string>('')
  protected readonly priceMin$ = new DeclarativeSubject<number | null>(null)
  protected readonly priceMax$ = new DeclarativeSubject<number | null>(null)
  protected readonly currency$ = new DeclarativeSubject<string>('')
  
  protected readonly retry$ = new Subject<void>()
  
  private readonly throttleFiltersTimeInMs = 2000;
  
  private readonly data$ = combineLatest({
    page: this.page$,
    pageSize: this.pageSize$,
    search: this.search$,
    priceMin: this.priceMin$,
    priceMax: this.priceMax$,
    currency: this.currency$,
  }).pipe(
    throttleTime(this.throttleFiltersTimeInMs, undefined, { leading: true, trailing: true }),
    tap(() => {
      this.loading$.value = true
      this.error$.value = false
    }),
    switchMap(
      ({ page, pageSize, ...filters }) =>
        this.etfs.getEtfList(page, pageSize, filters).pipe(
          tap(() => {
            this.loading$.value = false
          }),
          retry({
            delay: (error) => {
              console.error(error)
              this.error$.value = true
              this.loading$.value = false
              
              return this.retry$.pipe(
                tap(() => {
                  this.error$.value = false
                  this.loading$.value = true
                }),
              )
            },
          }),
        ),
    ),
  )
  
  protected readonly ctx$: Observable<Ctx> = combineLatest({
    loading: this.loading$.asObservable(),
    error: this.error$.asObservable(),
    data: this.data$.pipe(startWith(null)),
  }).pipe(debounceTime(0))
  
  protected readonly displayedColumns = [ 'name', 'price', 'currency' ]
  
  protected element(el: unknown): Etf {
    return el as Etf
  }
}
