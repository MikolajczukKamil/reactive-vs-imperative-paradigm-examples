import { Injectable }                 from '@angular/core'
import { Sort }                       from '@angular/material/sort'
import { delay, map, Observable, of } from 'rxjs'

import allEtfs from './etfs.json'


export interface Etf {
  name: string
  currency: string
  price: number
}

export interface Filters {
  search?: string
  currency?: string
  minPrice?: number
  maxPrice?: number
}

@Injectable({ providedIn: 'root' })
export class EtfService {
  private readonly all$: Observable<Etf[]> = of(allEtfs.filter(e => e.currency !== '—'))
  
  public getEtfList(page: number, pageSize: number, filters: Filters = {}, sort?: Sort): Observable<Etf[]> {
    return this.all$.pipe(
      map((all) => all.filter(el => this.filter(el, filters))),
      map((all) => {
        if (sort?.active) {
          [ ...all ].sort((a, b) => {
            const av = a[sort.active as keyof Etf]
            const bv = b[sort.active as keyof Etf]
            
            let res = 0
            
            if (typeof av === 'string') {
              res = av.localeCompare(bv as string)
            } else if (typeof av === 'number') {
              res = (bv as number) - av
            }
            
            return res * (sort.direction === 'desc' ? -1 : 1)
          })
        }
        
        return all
      }),
      map((all) => all.slice((page - 1) * pageSize, page * pageSize)),
      delay(3000 * Math.random()),
    )
  }
  
  private filter(el: Etf, { search, currency, maxPrice, minPrice }: Filters): boolean {
    if (search && !el.name.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    
    if (currency && el.currency !== currency) {
      return false
    }
    
    if (minPrice !== undefined && el.price < minPrice) {
      return false
    }
    
    if (maxPrice !== undefined && el.price > maxPrice) {
      return false
    }
    
    return true
  }
}
