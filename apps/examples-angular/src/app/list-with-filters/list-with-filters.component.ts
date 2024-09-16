import { AsyncPipe, JsonPipe }                                               from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Injectable,
  signal,
  Signal,
  ViewChild
}                                                                            from '@angular/core';
import {
  toObservable,
  toSignal
}                                                                            from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule }          from '@angular/forms';
import {
  MatButtonModule
}                                                                            from '@angular/material/button';
import {
  MatCardModule
}                                                                            from '@angular/material/card';
import {
  MatIconModule
}                                                                            from '@angular/material/icon';
import {
  MatInputModule
}                                                                            from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorIntl,
  PageEvent
}                                                                            from '@angular/material/paginator';
import {
  MatProgressBarModule
}                                                                            from '@angular/material/progress-bar';
import {
  MatSelectModule
}                                                                            from '@angular/material/select';
import {
  MatSort,
  MatSortModule,
  Sort
}                                                                            from '@angular/material/sort';
import {
  MatTableModule
}                                                                            from '@angular/material/table';
import { Etf }                                                               from '@org/common-lib';
import { debounceTime, map, Observable, of, retry, Subject, switchMap, tap } from 'rxjs';

import { EtfService } from './etf.service';


@Injectable()
class CustomMatPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Wierszy na stronę';
  override nextPageLabel = 'Przejdź do następnej strony';
  override previousPageLabel = 'Przejdź do poprzedniej strony';
  override firstPageLabel = 'Przejdź do pierwszej strony';
  override lastPageLabel = 'Przejdź do ostatniej strony';
  
  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 z ${ length }`;
    }
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return `${ startIndex + 1 } - ${ endIndex } z ${ length }`;
  };
}

const DEBOUNCE_TIME = 200;

interface Currency {
  code: string;
  name: string;
}

interface Values {
  filters: {
    search?: string
    priceMin?: number | null
    priceMax?: number | null
    currency?: string | null
  };
  page: number;
  pageSize: number;
  sort: Sort | null;
}

@Component({
  standalone: true,
  selector: 'app-list-with-filters',
  templateUrl: './list-with-filters.component.html',
  styleUrls: [ './list-with-filters.component.scss' ],
  providers: [ { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl } ],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    MatPaginator
  ]
})
export class ListWithFiltersComponent {
  private readonly etfService = inject(EtfService);
  
  @ViewChild(MatSort, { static: true })
  private readonly matSort!: MatSort;
  
  protected readonly displayedColumns = [ 'name', 'price', 'currency' ];
  protected readonly currencies: Currency[] = [
    { code: 'USD', name: 'Dolar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'Funt' },
    { code: 'CHF', name: 'Frank' },
    { code: 'PLN', name: 'Złoty' }
  ];
  protected readonly pageSizes = [ 5, 10, 20, 50, 100 ];
  
  protected readonly loading = signal(false);
  protected readonly error = signal(false);
  protected readonly page = signal(1);
  protected readonly pageSize = signal(this.pageSizes[0]);
  protected readonly allItems = signal<number>(0);
  protected readonly sort = signal<Sort | null>(null);
  
  protected readonly filters = new FormGroup({
    search: new FormControl<string>('', { nonNullable: true }),
    priceMin: new FormControl<number | null>(null),
    priceMax: new FormControl<number | null>(null),
    currency: new FormControl<string | null>(null)
  });
  
  private readonly filtersValue = toSignal(this.filters.valueChanges, { initialValue: this.filters.value });
  
  protected readonly retry$ = new Subject<void>();
  
  protected readonly loadedItems: Signal<Etf[]> = toSignal(
    toObservable(
      computed((): Values => ({
        filters: this.filtersValue(),
        page: this.page(),
        pageSize: this.pageSize(),
        sort: this.sort()
      }))
    ).pipe(
      debounceTime(DEBOUNCE_TIME),
      switchMap((values) => this.loadInstruments(values))
    ), { initialValue: [] }
  );
  
  constructor() {
    effect(() => {
      const change = [ this.sort(), this.filtersValue() ];
      if (!!change) this.page.set(1);
    }, { allowSignalWrites: true });
  }
  
  private loadInstruments(values: Values): Observable<Etf[]> {
    return of(null).pipe(
      tap(() => { this.loading.set(true); }),
      switchMap(() =>
        this.etfService.getEtfList(
          values.page,
          values.pageSize,
          values.filters,
          values.sort?.active,
          values.sort?.direction
        )),
      map((response) => {
        this.allItems.set(response.itemsCount);
        this.loading.set(false);
        this.error.set(false);
        return response.items;
      }),
      retry({
        delay: () => {
          this.loading.set(false);
          this.error.set(true);
          return this.retry$;
        }
      })
    );
  }
  
  protected resetFilters(): void {
    this.filters.reset();
    this.matSort.sort({ id: '', start: 'asc', disableClear: false });
  }
  
  protected element(el: unknown): Etf {
    return el as Etf;
  }
  
  protected handlePageEvent(e: PageEvent) {
    this.pageSize.set(e.pageSize);
    this.page.set(e.pageIndex + 1);
  }
}
