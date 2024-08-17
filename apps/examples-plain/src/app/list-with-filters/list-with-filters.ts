import { Etf }             from '@org/common-lib';
import { initMDB, Ripple, Input, Button } from 'mdb-ui-kit';

import { CustomElement, defineComponent } from '../utils';

import componentTemplate     from './list-with-filters.html';
import './list-with-filters.scss';
import { injectEtfsService } from './use-etfs';
import '../app-paginator';


const pageSizes = [ 5, 10, 20, 50, 100 ];

class ListWithFilterComponent extends CustomElement {
  public isLoading = false;
  public instruments: Etf[] = [];
  public page = 1;
  public pageSize = pageSizes[0];
  public sortProperty?: string;
  public sortDirection?: 'asc' | 'desc';
  public search = '';
  public minPrice = '';
  public maxPrice = '';
  public currency = '';
  public allItems = 0;
  
  private readonly etfService = injectEtfsService();
  
  public constructor() { super(componentTemplate); }
  
  protected override connectedCallback(): void {
    super.connectedCallback();
    
    this.bindChangeValue('#search-input', e => {
      this.search = e.value;
      
      if (this.page !== 1) {
        this.page = 1;
        this.updatePaginator();
      }
      
      this.reloadInstrument();
    });
    
    this.bindChangeValue('#price-min-input', e => {
      this.minPrice = e.value;
      
      if (this.page !== 1) {
        this.page = 1;
        this.updatePaginator();
      }
      
      this.reloadInstrument();
    });
    
    this.bindChangeValue('#price-max-input', e => {
      this.maxPrice = e.value;
      
      if (this.page !== 1) {
        this.page = 1;
        this.updatePaginator();
      }
      
      this.reloadInstrument();
    });
    
    this.bindChangeValue('#input-currency', e => {
      this.currency = e.value;
      
      if (this.page !== 1) {
        this.page = 1;
        this.updatePaginator();
      }
      
      this.reloadInstrument();
    });
    
    this.querySelector('#clear-filters')!.addEventListener('click', () => {
      this.search = '';
      this.currency = '';
      this.minPrice = '';
      this.maxPrice = '';
      
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
    
    this.reloadInstrument();
    this.reloadFilters();
    this.updatePaginator();
    
    initMDB({ Ripple, Input ,Button});
  }
  
  private reloadFilters(): void {
    this.querySelector<HTMLInputElement>('#search-input')!.value = this.search;
    this.querySelector<HTMLInputElement>('#price-min-input')!.value = this.minPrice;
    this.querySelector<HTMLInputElement>('#price-max-input')!.value = this.maxPrice;
    this.querySelector<HTMLSelectElement>('#input-currency')!.value = this.currency;
  }
  
  private updatePaginator(): void {
    const paginator = this.querySelector('#instruments-paginator')!;
    
    paginator.setAttribute('page', this.page.toString());
    paginator.setAttribute('length', this.allItems.toString());
    paginator.setAttribute('pagesize', this.pageSize.toString());
  }
  
  private reloadInstrument(): void {
    this.isLoading = true;
    this.updateLoading();
    
    this.etfService.getEtfList(this.page, this.pageSize, {
            search: this.search || null,
            priceMin: parseFloat(this.minPrice) || null,
            priceMax: parseFloat(this.maxPrice) || null,
            currency: this.currency || null
          },
          this.sortProperty,
          this.sortDirection
        )
        .then((page) => {
          this.isLoading = false;
          this.instruments = page.items;
          this.allItems = page.itemsCount;
          
          this.updateList();
          this.updateLoading();
          this.updatePaginator();
        })
        .catch((error) => {
          console.error(error);
          
          this.isLoading = false;
          this.updateLoading();
        });
  }
  
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
