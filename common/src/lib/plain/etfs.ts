import { EtfService }          from '../etfs'
import { EtfLocalImplService } from '../etfs/etf-local.impl.service'


export * from '../etfs/etf.service'
export * from '../etfs/types'


export function injectEtfsService(): EtfService {
  return new EtfLocalImplService()
}
