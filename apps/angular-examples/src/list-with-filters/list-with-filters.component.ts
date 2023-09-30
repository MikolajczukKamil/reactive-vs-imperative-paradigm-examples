import { AsyncPipe, NgIf }                                       from '@angular/common'
import { Component, inject }                                     from '@angular/core'
import { MatCardModule }                                         from '@angular/material/card'
import { MatIconModule }                                         from '@angular/material/icon'
import { MatInputModule }                                        from '@angular/material/input'
import {
  MatProgressBarModule,
}                                                                from '@angular/material/progress-bar'
import { MatSelectModule }                                       from '@angular/material/select'
import { MatSortModule, Sort }                                   from '@angular/material/sort'
import { MatTableModule }                                        from '@angular/material/table'
import { BehaviorSubject, combineLatest, Observable, startWith } from 'rxjs'

import { Etf, EtfService } from './etfs'


interface Ctx {
  loading: boolean
  error: boolean
  data: Etf[] | null
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
  ],
  selector: 'list-with-filters',
  templateUrl: './list-with-filters.component.html',
  styleUrls: [ './list-with-filters.component.scss' ],
})
export class ListWithFiltersComponent {
  private readonly etfs = inject(EtfService)
  
  protected readonly loading$ = new BehaviorSubject(false)
  protected readonly error$ = new BehaviorSubject(false)
  protected readonly sort$ = new BehaviorSubject<Sort | null>(null)
  
  protected readonly data$ = this.etfs.getEtfList(1, 25, {})
  protected readonly displayedColumns = [ 'name', 'price', 'currency' ]
  
  protected readonly ctx$: Observable<Ctx> = combineLatest({
    loading: this.loading$.asObservable(),
    error: this.error$.asObservable(),
    data: this.data$.pipe(startWith(null)),
  })
  
  element(el: unknown): Etf {
    return el as Etf
  }
}
