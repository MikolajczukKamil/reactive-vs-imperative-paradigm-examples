import { SortDirection } from '@mui/material/TableCell/TableCell'
import { useMemo }       from 'react'

import allEtfs from './etfs.json'


export interface Sort {
  active: string;
  direction: SortDirection;
}

export interface Etf {
  readonly name: string
  readonly currency: string
  readonly price: number
}

export interface EtfPage {
  readonly items: Etf[];
  readonly itemsCount: number;
}

export interface Filters {
  readonly search?: string | null
  readonly currency?: string | null
  readonly minPrice?: number | null
  readonly maxPrice?: number | null
}

function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}


class EtfServiceImpl implements EtfService {
  public async getEtfList(page: number, pageSize: number, filters: Filters = {}, sort?: Sort | null): Promise<EtfPage> {
    let list: Etf[] = allEtfs
    
    list = list.filter((el) => this.filter(el, filters))
    
    if (sort?.active) {
      list = [ ...list ].sort((a, b) => {
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
    
    await wait(2000 * Math.random() + 200)
    
    return {
      itemsCount: list.length,
      items: list.slice((page - 1) * pageSize, page * pageSize),
    }
  }
  
  private filter(el: Etf, { search, currency, maxPrice, minPrice }: Filters): boolean {
    if (search && !el.name.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    
    if (currency && el.currency !== currency) {
      return false
    }
    
    if (minPrice && el.price < minPrice) {
      return false
    }
    
    if (maxPrice && el.price > maxPrice) {
      return false
    }
    
    return true
  }
}

export interface EtfService {
  getEtfList(page: number, pageSize: number, filters?: Filters, sort?: Sort | null): Promise<EtfPage>;
}

export function useEtfsService(): EtfService {
  return useMemo(() => new EtfServiceImpl(), [])
}
