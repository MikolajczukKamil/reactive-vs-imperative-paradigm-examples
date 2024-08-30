import { ETF_SERVER, EtfPage } from '@org/common-lib';
import { useMemo }             from 'react';
import { Observable, tap }     from 'rxjs';
import { fromFetch }           from 'rxjs/fetch';


export interface IEtfFilters {
  search?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
  currency?: string | null;
}

export class EtfService {
  public getEtfList(page: number, pageSize: number, filters: IEtfFilters, sortProperty?: string, sortDirections?: string): Observable<EtfPage> {
    return fromFetch(ETF_SERVER + '?' + Object.entries(this.deleteEmpty({
      'page': page,
      'page-size': pageSize,
      'sort-property': sortProperty,
      'sort-direction': sortDirections,
      'search': filters.search,
      'currency': filters.currency,
      'min-price': filters.priceMin,
      'max-price': filters.priceMax
    })).map(([ key, value ]) => key + '=' + value.toString()).join('&'),
      { selector: response => response.json() }
    ).pipe(
      tap({
        next: (v: any) => {
          if (v.message) {
            console.error('ERROR', v);
            throw new Error(v.message);
          }
        },
        error: (error) => {
          console.error(error);
        }
      }));
  }
  
  private deleteEmpty(params: Record<string, string | number | boolean | undefined | null>): Record<string, string | number | boolean> {
    return Object.fromEntries(
      Object.entries(params).filter((entry): entry is [ string, string | number | boolean ] => !!entry[1])
    );
  }
}


export function useEtfsService() {
  return useMemo(() => new EtfService(), []);
}

