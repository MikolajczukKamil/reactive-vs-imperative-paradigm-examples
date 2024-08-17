import { CustomElement, defineComponent } from '../utils'

import componentTemplate from './app-paginator.html'
import './app-paginator.scss'


export interface AppPaginatorComponentProps {
  page: string;
  length: string;
  pagesize: string;
  pagesizes: string;
}

class AppPaginatorComponent extends CustomElement<AppPaginatorComponentProps> implements AppPaginatorComponentProps {
  public static observedAttributes = [ 'page', 'length', 'pagesize', 'pagesizes' ] as const
  
  //
  public set page(page: string) {
    this.updateElementCounter()
    
    this.updateButtonsDisabled()
  }
  
  public get page(): string {
    return this.getAttribute('page') || ''
  }
  
  //
  public set length(length: string) {
    this.querySelector<HTMLElement>('.all-length')!.innerText = length
    
    this.updateButtonsDisabled()
  }
  
  public get length(): string {
    return this.getAttribute('length') || ''
  }
  
  //
  public set pagesize(pagesize: string) {
    this.updateElementCounter()
    this.updateButtonsDisabled()
    
    this.querySelector<HTMLSelectElement>('.pages')!.value = pagesize
  }
  
  public get pagesize(): string {
    return this.getAttribute('pagesize') || ''
  }
  
  //
  public set pagesizes(pagesizes: string) {
    const pagesize = this.pagesize
    
    this.querySelector<HTMLSelectElement>('.pages')!.replaceChildren(
      ...pagesizes.split(',').map(size => {
        const element: HTMLOptionElement = document.createElement('option')
        element.value = size.trim()
        element.innerText = size
        return element
      }),
    )
    
    this.pagesize = pagesize
  }
  
  public get pagesizes(): string {
    return this.getAttribute('pagesizes') || ''
  }
  
  //
  public constructor() { super(componentTemplate) }
  
  private updateElementCounter(): void {
    let end = parseInt(this.page) * parseInt(this.pagesize)
    const start = end - parseInt(this.pagesize) + 1
    end = Math.min(end, parseInt(this.length))
    
    this.querySelector<HTMLElement>('.page-start')!.innerText = start.toString()
    this.querySelector<HTMLElement>('.page-end')!.innerText = end.toString()
  }
  
  private updateButtonsDisabled(): void {
    const isFirstPage= this.page === '1'
    const isLastPage= this.page === Math.ceil(parseInt(this.length) / parseInt(this.pagesize)).toString()
    
    this.querySelector<HTMLButtonElement>('#back-all')!.disabled = isFirstPage
    this.querySelector<HTMLButtonElement>('#back')!.disabled = isFirstPage
    this.querySelector<HTMLButtonElement>('#next')!.disabled = isLastPage
    this.querySelector<HTMLButtonElement>('#next-all')!.disabled = isLastPage
  }
  
  protected override connectedCallback(): void {
    super.connectedCallback()
    
    this.querySelector<HTMLSelectElement>('.pages')!.addEventListener('change', (e) => {
      const newPage = this.querySelector<HTMLSelectElement>('.pages')!.value
      
      this.dispatchEvent(new CustomEvent('page-size', { detail: newPage }))
      this.setAttribute('page-size', newPage)
    })
    
    //
    this.querySelector('#back-all')!.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('page', { detail: 1 }))
    })
    
    this.querySelector('#back')!.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('page', { detail: parseInt(this.page) - 1 }))
    })
    
    this.querySelector('#next')!.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('page', { detail: parseInt(this.page) + 1 }))
    })
    
    this.querySelector('#next-all')!.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('page', { detail: Math.ceil(parseInt(this.length) / parseInt(this.pagesize)) }))
    })
    
    this.updateButtonsDisabled()
  }
}

export const AppPaginator = defineComponent('app-paginator', AppPaginatorComponent)
