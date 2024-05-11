import { AsyncPipe, JsonPipe, NgIf }                                from '@angular/common'
import { Component, inject, Signal, signal }                        from '@angular/core'
import {
  toSignal,
}                                                                   from '@angular/core/rxjs-interop'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule }                                          from '@angular/material/button'
import { MatCardModule }                                            from '@angular/material/card'
import { MatIconModule }                                            from '@angular/material/icon'
import { MatInputModule }                                           from '@angular/material/input'
import {
  MatProgressBarModule,
}                                                                   from '@angular/material/progress-bar'
import { MatSelectModule }                                          from '@angular/material/select'
import { MatSortModule, Sort }                                      from '@angular/material/sort'
import { MatTableModule }                                           from '@angular/material/table'
import { map, retry, Subject, switchMap, tap, throttleTime }        from 'rxjs'

import { Etf, EtfService } from './etfs'


const THROTTLE_TIME = 2000

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
    NgIf,
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
    JsonPipe,
  ],
  selector: 'list-with-filters',
  templateUrl: './list-with-filters.component.html',
  styleUrls: [ './list-with-filters.component.scss' ],
})
export class ListWithFiltersComponent {
  private readonly etfs = inject(EtfService)
  
  protected readonly displayedColumns = [ 'name', 'price', 'currency' ]
  
  protected readonly loading = signal(false)
  protected readonly error = signal(false)
  protected readonly sort = signal<Sort | null>(null)
  
  protected readonly retry$ = new Subject<void>()
  
  protected readonly filters = new FormGroup({
    page: new FormControl(0, { nonNullable: true }),
    pageSize: new FormControl(0, { nonNullable: true }),
    search: new FormControl('', { nonNullable: true }),
    priceMin: new FormControl(0),
    priceMax: new FormControl(0),
    currency: new FormControl(null),
  })
  
  protected readonly loadedItems: Signal<Etf[]> = toSignal(
    this.filters.valueChanges.pipe(
      throttleTime(THROTTLE_TIME, undefined, { leading: true, trailing: true }),
      tap(() => {
        this.error.set(false)
        this.loading.set(true)
      }),
      map((): EtfFilters => this.filters.value),
      switchMap(
        ({ page, pageSize, ...filters }) =>
          this.etfs.getEtfList(page || 0, pageSize || 0, filters).pipe(
            tap(() => {
              this.loading.set(false)
            }),
            retry({
              delay: (error) => {
                console.error(error)
                
                this.error.set(true)
                this.loading.set(false)
                
                return this.retry$.pipe(
                  tap(() => {
                    this.error.set(false)
                    this.loading.set(true)
                  }),
                )
              },
            }),
          ),
      ),
    ),
    { initialValue: [] },
  )
  
  protected element(el: unknown): Etf {
    return el as Etf
  }
}
