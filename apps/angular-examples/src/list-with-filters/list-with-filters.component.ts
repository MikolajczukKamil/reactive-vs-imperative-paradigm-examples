import { AsyncPipe, JsonPipe } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
  signal,
}                              from '@angular/core'
import {
  toObservable,
  toSignal,
}                              from '@angular/core/rxjs-interop'
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
}                              from '@angular/forms'
import {
  MatButtonModule,
}                              from '@angular/material/button'
import {
  MatCardModule,
}                              from '@angular/material/card'
import {
  MatIconModule,
}                              from '@angular/material/icon'
import {
  MatInputModule,
}                              from '@angular/material/input'
import {
  MatPaginator,
  PageEvent,
}                              from '@angular/material/paginator'
import {
  MatProgressBarModule,
}                              from '@angular/material/progress-bar'
import {
  MatSelectModule,
}                              from '@angular/material/select'
import {
  MatSortModule,
  Sort,
}                              from '@angular/material/sort'
import {
  MatTableModule,
}                              from '@angular/material/table'
import {
  debounceTime, map,
  merge,
  Observable,
  of,
  retry,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs'

import { Etf, EtfService } from './etfs'


const DEBOUNCE_TIME = 200

interface EtfFilters {
  page?: number | null
  pageSize?: number | null
  search?: string | null
  priceMin?: number | null
  priceMax?: number | null
  currency?: string | null
}

@Component({
  standalone: true,
  imports: [
    JsonPipe,
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatProgressBarModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatSortModule,
    MatButtonModule,
    MatPaginator,
  ],
  selector: 'list-with-filters',
  templateUrl: './list-with-filters.component.html',
  styleUrls: [ './list-with-filters.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListWithFiltersComponent {
  private readonly etfService = inject(EtfService)
  
  protected readonly displayedColumns = [ 'name', 'price', 'currency' ]
  protected readonly pageSizes = [ 5, 10, 20, 50, 100 ]
  
  protected readonly loading = signal(false)
  protected readonly error = signal(false)
  protected readonly page = signal(1)
  protected readonly pageSize = signal(10)
  protected readonly allItems = signal<number>(0)
  protected readonly pages = computed(() => Math.ceil(this.allItems() / this.pageSize()))
  protected readonly sort = signal<Sort | null>(null)
  
  protected readonly retry$ = new Subject<void>()
  
  protected readonly filters = new FormGroup({
    search: new FormControl<string>('', { nonNullable: true }),
    priceMin: new FormControl<number | null>(null),
    priceMax: new FormControl<number | null>(null),
    currency: new FormControl<string | null>(null),
  })
  
  private readonly reloadValues$: Observable<unknown> = merge(
    this.filters.valueChanges,
    toObservable(this.page),
    toObservable(this.pageSize),
    toObservable(this.sort),
  )
  
  protected readonly loadedItems: Signal<Etf[]> = toSignal(
    this.reloadValues$.pipe(
      startWith(null),
      debounceTime(DEBOUNCE_TIME),
      switchMap(() => this.loadInstruments()),
    ),
    { initialValue: [] },
  )
  
  private loadInstruments(): Observable<Etf[]> {
    return of(null).pipe(
      tap(() => {
        this.loading.set(true)
      }),
      switchMap(() => this.etfService.getEtfList(this.page(), this.pageSize(), this.filters.value, this.sort())),
      map((response) => {
        this.allItems.set(response.itemsCount)
        
        this.loading.set(false)
        this.error.set(false)
        
        return response.items
      }),
      retry({
        delay: (error) => {
          console.error(error)
          this.error.set(true)
          
          return this.retry$
        },
      }),
    )
  }
  
  protected element(el: unknown): Etf {
    return el as Etf
  }
  
  protected log(e: any) {
    // this.pageSize.set(e)
    console.log({ e })
  }
  
  protected handlePageEvent(e: PageEvent) {
    this.pageSize.set(e.pageSize)
    this.page.set(e.pageIndex + 1)
  }
}
