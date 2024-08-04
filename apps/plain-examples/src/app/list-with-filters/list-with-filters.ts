// @ts-ignore
import { initMDB, Ripple } from 'mdb-ui-kit'

import { CustomElement, defineComponent } from '../utils'
import { Etf, injectEtfsService }         from './etfs'

import componentTemplate from './list-with-filters.html'
import './list-with-filters.scss'


export interface AppComponentProps {
  title: string;
}

class ListWithFilterComponent extends CustomElement<AppComponentProps> implements AppComponentProps {
  public static observedAttributes = [ 'title' ] as const
  
  public isLoading = false
  public instruments: Etf[] = []
  private etfService = injectEtfsService()
  
  public set title(title: string) {
    this.template.innerText = `Hello ${ title }!`
  }
  
  public get title(): string {
    return this.getAttribute('title') || ''
  }
  
  public constructor() { super(componentTemplate) }
  
  protected override connectedCallback(): void {
    super.connectedCallback()
    
    this.reloadInstrument()
    
    initMDB({ Ripple })
  }
  
  private reloadInstrument(): void {
    this.isLoading = true
    this.updateLoading()
    
    this.etfService.getEtfList(1, 10)
        .then((page) => {
          this.isLoading = false
          this.instruments = page.items
          
          this.updateList()
          this.updateLoading()
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
}

export const ListWithFilters = defineComponent('list-with-filters', ListWithFilterComponent)
