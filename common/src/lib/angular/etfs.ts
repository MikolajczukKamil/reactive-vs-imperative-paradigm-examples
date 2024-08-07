import { Injectable }        from '@angular/core'
import { defer, Observable } from 'rxjs'

import { EtfService as EtfServiceOriginal } from '../etfs'
import { EtfLocalImplService }              from '../etfs/etf-local.impl.service'
import { EtfPage, Filters, Sort }           from '../etfs/types'


export * from '../etfs/etf.service'
export * from '../etfs/types'

@Injectable({ providedIn: 'root' })
export class EtfService {
  private readonly original: EtfServiceOriginal = new EtfLocalImplService()
  
  public getEtfList(page: number, pageSize: number, filters?: Filters, sort?: Sort | null): Observable<EtfPage> {
    return defer(() => this.original.getEtfList(page, pageSize, filters, sort))
  }
}
