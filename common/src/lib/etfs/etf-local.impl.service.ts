import { EtfService }                  from './etf.service'
import allEtfs                         from './etfs.json'
import { Etf, EtfPage, Filters, Sort } from './types'


function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export class EtfLocalImplService extends EtfService {
  public override async getEtfList(page: number, pageSize: number, filters: Filters = {}, sort?: Sort | null): Promise<EtfPage> {
    console.log('Request start', { page, pageSize, filters, sort })
    
    let list: Etf[] = allEtfs.filter(e => e.currency !== '—' && e.price > 0)
    
    list = list.filter((el) => this.filter(el, filters))
    
    if (sort?.active) {
      list = [ ...list ].sort((a, b) => {
        const av = a[sort.active as keyof Etf]
        const bv = b[sort.active as keyof Etf]
        
        let res = 0
        
        if (typeof av === 'string') {
          res = av.localeCompare(bv as string)
        } else {
          res = (bv as number) - av
        }
        
        return res * (sort.direction === 'desc' ? -1 : 1)
      })
    }
    
    await wait(2000 * Math.random() + 200)
    
    // if (Math.random() < 0.2) {
    //   throw new Error(`Dziwny błąd`)
    // }
    
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

