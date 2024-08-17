export interface Etf {
  readonly name: string;
  readonly currency: string;
  readonly price: number;
}

export type SortProperty = keyof Etf;
export type SortDirection = 'asc' | 'desc';

export interface EtfPage {
  readonly items: Etf[];
  readonly itemsCount: number;
}
