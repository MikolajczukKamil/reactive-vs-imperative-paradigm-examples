import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable }     from '@angular/core';
import { ETF_SERVER, EtfPage }    from '@org/common-lib';
import { Observable, tap }        from 'rxjs';


export interface IEtfFilters {
  search?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
  currency?: string | null;
}

@Injectable({ providedIn: 'root' })
export class EtfService {
  private readonly http = inject(HttpClient);
  
  public getEtfList(page: number, pageSize: number, filters: IEtfFilters, sortProperty?: string, sortDirections?: string): Observable<EtfPage> {
    return this.http.get<EtfPage>(ETF_SERVER,
      {
        params: new HttpParams({
          fromObject: this.deleteEmpty({
            'page': page,
            'page-size': pageSize,
            'sort-property': sortProperty,
            'sort-direction': sortDirections,
            'search': filters.search,
            'currency': filters.currency,
            'min-price': filters.priceMin,
            'max-price': filters.priceMax
          })
        })
      }
    ).pipe(
      tap({
        error: (err) => {
          console.error(err);
        }
      })
    );
  }
  
  private deleteEmpty(params: Record<string, string | number | boolean | undefined | null>): Record<string, string | number | boolean> {
    return Object.fromEntries(
      Object.entries(params).filter((entry): entry is [ string, string | number | boolean ] => !!entry[1])
    );
  }
}
