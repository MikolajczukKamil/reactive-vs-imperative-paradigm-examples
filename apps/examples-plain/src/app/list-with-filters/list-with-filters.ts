/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Etf }                            from '@org/common-lib';
import { Button, initMDB, Input, Ripple } from 'mdb-ui-kit';

import { CustomElement, defineComponent } from '../utils';
import { injectEtfsService } from './use-etfs';

import componentTemplate from './list-with-filters.html';
import './list-with-filters.scss';
import '../app-paginator';

// eslint-disable-next-line @typescript-eslint/ban-types
function debounce<T extends Function>(fn: T, delay: number): T {
  let timeoutId: NodeJS.Timeout | undefined;
  
  return function (this: any, ...args: any[]): void {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  } as any as T;
}


const pageSizes = [ 5, 10, 20, 50, 100 ];

class ListWithFilterComponent extends CustomElement {
  public isLoading = false;
  public instruments: Etf[] = [];
  public page = 1;
  public pageSize = pageSizes[1];
  public sortProperty?: string;
  public sortDirection?: 'asc' | 'desc';
  public filters = {
    search: '',
    minPrice: '',
    maxPrice: '',
    currency: '',
  }
  public allItems = 0;
  public isError = false;
  
  private readonly etfService = injectEtfsService();
  
  public constructor() { super(componentTemplate); }
  
  protected override connectedCallback(): void {
    super.connectedCallback();
    
    this.bindChangeValue('#search-input', e => {
      this.filters.search = e.value;
      
      if (this.page !== 1) {
        this.page = 1;
        this.updatePaginator();
      }
      
      this.reloadInstrument();
    });
    
    this.bindChangeValue('#price-min-input', e => {
      this.filters.minPrice = e.value;
      
      if (this.page !== 1) {
        this.page = 1;
        this.updatePaginator();
      }
      
      this.reloadInstrument();
    });
    
    this.bindChangeValue('#price-max-input', e => {
      this.filters.maxPrice = e.value;
      
      if (this.page !== 1) {
        this.page = 1;
        this.updatePaginator();
      }
      
      this.reloadInstrument();
    });
    
    this.bindChangeValue('#input-currency', e => {
      this.filters.currency = e.value;
      
      if (this.page !== 1) {
        this.page = 1;
        this.updatePaginator();
      }
      
      this.reloadInstrument();
    });
    
    this.querySelector('#clear-filters')!.addEventListener('click', () => {
      this.filters = {
        search: '',
        minPrice: '',
        maxPrice: '',
        currency: '',
      }
      
      if (this.page !== 1) {
        this.page = 1;
        this.updatePaginator();
      }
      
      this.reloadInstrument();
      this.reloadFilters();
    });
    
    const paginator = this.querySelector('#instruments-paginator')!;
    
    paginator.addEventListener('page-size', (e) => {
      this.pageSize = parseInt(this.eventDetail(e));
      
      if (this.page !== 1) {
        this.page = 1;
        this.updatePaginator();
      }
      
      this.reloadInstrument();
    });
    
    paginator.addEventListener('page', (e) => {
      this.page = parseInt(this.eventDetail(e));
      
      this.reloadInstrument();
    });
    
    this.querySelector('.error button')!.addEventListener('click', () => {
      console.log('Reload');
      this.reloadInstrument();
    });
    
    this.reloadInstrument();
    this.reloadFilters();
    this.updatePaginator();
    this.updateError();
    
    initMDB({ Ripple, Input, Button });
  }
  
  private updateError(): void {
    this.querySelector<HTMLElement>('.error')!.style.display = this.isError ? '' : 'none';
    this.querySelector<HTMLElement>('.error .icon')!.style.display = this.instruments.length === 0 ? '' : 'none';
  }
  
  private reloadFilters(): void {
    this.querySelector<HTMLInputElement>('#search-input')!.value = this.filters.search;
    this.querySelector<HTMLInputElement>('#price-min-input')!.value = this.filters.minPrice;
    this.querySelector<HTMLInputElement>('#price-max-input')!.value = this.filters.maxPrice;
    this.querySelector<HTMLSelectElement>('#input-currency')!.value = this.filters.currency;
  }
  
  private updatePaginator(): void {
    const paginator = this.querySelector('#instruments-paginator')!;
    
    paginator.setAttribute('page', this.page.toString());
    paginator.setAttribute('length', this.allItems.toString());
    paginator.setAttribute('pagesize', this.pageSize.toString());
  }
  
  private reloadInstrumentClearCallback?: () => void;
  
private reloadInstrument = debounce((): void =>  {
  this.reloadInstrumentClearCallback?.();
  let active = true;
  
  this.reloadInstrumentClearCallback = () => {
    active = false;
  };
  
  this.isLoading = true;
  this.updateLoading();
  
  this.etfService.getEtfList(
        this.page,
        this.pageSize,
        {
          ...this.filters,
          priceMin: parseFloat(this.filters.minPrice) || null,
          priceMax: parseFloat(this.filters.maxPrice) || null,
        },
        this.sortProperty,
        this.sortDirection
      )
      .then((page) => {
        if (active) {
          this.isLoading = false;
          this.isError = false;
          this.instruments = page.items;
          this.allItems = page.itemsCount;
          
          this.updateList();
          this.updateError();
          this.updateLoading();
          this.updatePaginator();
        }
      })
      .catch((error) => {
        if (active) {
          console.error(error);
          
          this.isError = true;
          this.isLoading = false;
          this.updateLoading();
          this.updateError();
        }
      });
}, 200)
  
  private updateLoading(): void {
    const loadingElement = this.querySelector<HTMLElement>('#loading')!;
    
    loadingElement.style.display = this.isLoading ? 'block' : 'none';
  }
  
  private updateList(): void {
    const instrumentsList = this.querySelector<HTMLElement>('#instruments-list')!;
    
    console.log(this.instruments, instrumentsList);
    
    instrumentsList.replaceChildren(
      ...this.instruments.map((instrument) => {
        const cell = document.createElement('tr');
        
        cell.innerHTML = `<td>${ instrument.name }</td><td>${ instrument.price }</td><td>${ instrument.currency }</td>`;
        
        return cell;
      })
    );
  }
  
  private eventDetail(e: Event): string {
    return (e as any).detail || '';
  }
}

export const ListWithFilters = defineComponent('list-with-filters', ListWithFilterComponent);
