import { Etf, Filters, injectEtfsService, Sort } from 'common/src/lib/plain/etfs'
// @ts-ignore
import { initMDB, Ripple }                       from 'mdb-ui-kit'

import { CustomElement, defineComponent } from '../utils'

import componentTemplate from './list-with-filters.html'
import './list-with-filters.scss'
import '../app-paginator'


class ListWithFilterComponent extends CustomElement {
  public isLoading = false
  public instruments: Etf[] = []
  public page = 1
  public pageSize = 5
  public sorting?: Sort | null
  public filters: Filters = {
    search: null,
    currency: null,
    minPrice: null,
    maxPrice: null,
  }
  public allItems = 0
  
  private readonly etfService = injectEtfsService()
  
  public constructor() { super(componentTemplate) }
  
  protected override connectedCallback(): void {
    super.connectedCallback()
    
    this.bindChangeValue('#search-input', e => {
      this.filters = { ...this.filters, search: e.value }
      
      if (this.page !== 1) {
        this.page = 1
        this.updatePaginator()
      }
      
      this.reloadInstrument()
    })
    
    this.bindChangeValue('#price-min-input', e => {
      this.filters = { ...this.filters, minPrice: parseFloat(e.value) }
      
      if (this.page !== 1) {
        this.page = 1
        this.updatePaginator()
      }
      
      this.reloadInstrument()
    })
    
    this.bindChangeValue('#price-max-input', e => {
      this.filters = { ...this.filters, maxPrice: parseFloat(e.value) }
      
      if (this.page !== 1) {
        this.page = 1
        this.updatePaginator()
      }
      
      this.reloadInstrument()
    })
    
    this.bindChangeValue('#input-currency', e => {
      this.filters = { ...this.filters, currency: e.value }
      
      if (this.page !== 1) {
        this.page = 1
        this.updatePaginator()
      }
      
      this.reloadInstrument()
    })
    
    this.querySelector('#clear-filters')!.addEventListener('click', () => {
      this.filters = {
        search: null,
        currency: null,
        minPrice: null,
        maxPrice: null,
      }
      
      if (this.page !== 1) {
        this.page = 1
        this.updatePaginator()
      }
      
      this.reloadInstrument()
      this.reloadFilters()
    })
    
    const paginator = this.querySelector('#instruments-paginator')!
    
    paginator.addEventListener('page-size', (e) => {
      this.pageSize = parseInt(this.eventDetail(e))
      
      if (this.page !== 1) {
        this.page = 1
        this.updatePaginator()
      }
      
      this.reloadInstrument()
    })
    
    paginator.addEventListener('page', (e) => {
      this.page = parseInt(this.eventDetail(e))
      
      this.reloadInstrument()
    })
    
    this.reloadInstrument()
    this.reloadFilters()
    this.updatePaginator()
    
    initMDB({ Ripple })
  }
  
  private reloadFilters(): void {
    this.querySelector<HTMLInputElement>('#search-input')!.value = this.filters.search || ''
    this.querySelector<HTMLInputElement>('#price-min-input')!.value = this.filters.minPrice?.toString() || ''
    this.querySelector<HTMLInputElement>('#price-max-input')!.value = this.filters.maxPrice?.toString() || ''
    this.querySelector<HTMLSelectElement>('#input-currency')!.value = this.filters.currency?.toString() || ''
  }
  
  private updatePaginator(): void {
    const paginator = this.querySelector('#instruments-paginator')!
    
    paginator.setAttribute('page', this.page.toString())
    paginator.setAttribute('length', this.allItems.toString())
    paginator.setAttribute('pagesize', this.pageSize.toString())
  }
  
  private reloadInstrument(): void {
    this.isLoading = true
    this.updateLoading()
    
    this.etfService.getEtfList(this.page, this.pageSize, this.filters, this.sorting)
        .then((page) => {
          this.isLoading = false
          this.instruments = page.items
          this.allItems = page.itemsCount
          
          this.updateList()
          this.updateLoading()
          this.updatePaginator()
        })
        .catch((error) => {
          console.error(error)
          
          this.isLoading = false
          this.updateLoading()
        })
  }
  
  private updateLoading(): void {
    const loadingElement = this.querySelector<HTMLElement>('#loading')!
    
    loadingElement.style.display = this.isLoading ? 'block' : 'none'
  }
  
  private updateList(): void {
    const instrumentsList = this.querySelector<HTMLElement>('#instruments-list')!
    
    console.log(this.instruments, instrumentsList)
    
    instrumentsList.replaceChildren(
      ...this.instruments.map((instrument) => {
        const cell = document.createElement('tr')
        
        cell.innerHTML = `<td>${ instrument.name }</td><td>${ instrument.price }</td><td>${ instrument.currency }</td>`
        
        return cell
      }),
    )
    
  }
  
  private eventDetail(e: Event): string {
    return (e as any).detail || ''
  }
}

export const ListWithFilters = defineComponent('list-with-filters', ListWithFilterComponent)
