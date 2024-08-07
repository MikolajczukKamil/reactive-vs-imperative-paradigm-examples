import { EtfPage, Filters, Sort } from './types'


export abstract class EtfService {
  public abstract getEtfList(page: number, pageSize: number, filters?: Filters, sort?: Sort | null): Promise<EtfPage>;
}
