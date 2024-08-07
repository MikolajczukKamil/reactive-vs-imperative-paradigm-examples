export type SortDirection = 'asc' | 'desc' | false;

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
