import { Injectable }                                from '@nestjs/common';
import { Etf, EtfPage, SortDirection, SortProperty } from '@org/common-lib';

import allEtfs from './data/etfs.json';


function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export interface Filters {
  readonly search?: string | null
  readonly currency?: string | null
  readonly minPrice?: number | null
  readonly maxPrice?: number | null
}

export interface Sort {
  property?: SortProperty;
  direction?: SortDirection;
}


@Injectable()
export class EtfService {
  private readonly allEtfs: Etf[] = allEtfs;
  
  public async getEtfList(page: number, pageSize: number, filters: Filters, sort: Sort): Promise<EtfPage> {
    let list: Etf[] = this.allEtfs.filter(e => e.currency !== '—' && e.price > 0);
    
    list = list.filter((el) => this.filter(el, filters));
    
    if (sort.property) {
      list = [ ...list ].sort((a, b) => {
        const av = a[sort.property as keyof Etf];
        const bv = b[sort.property as keyof Etf];
        
        let res = 0;
        
        if (typeof av === 'string') {
          res = av.localeCompare(bv as string);
        } else {
          res = (bv as number) - av;
        }
        
        return res * (sort.direction === 'desc' ? -1 : 1);
      });
    }
    
    await wait(2000 * Math.random() + 200);
    
    if (Math.random() < 0.5) {
      // throw new Error(`Dziwny błąd, uwaga pojawia się losowo`)
    }
    
    return {
      itemsCount: list.length,
      items: list.slice((page - 1) * pageSize, page * pageSize)
    };
  }
  
  private filter(el: Etf, { search, currency, maxPrice, minPrice }: Filters): boolean {
    if (search && !el.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    if (currency && el.currency !== currency) {
      return false;
    }
    
    if (minPrice && el.price < minPrice) {
      return false;
    }
    
    if (maxPrice && el.price > maxPrice) {
      return false;
    }
    
    return true;
  }
}
