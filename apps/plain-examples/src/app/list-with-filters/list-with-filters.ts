// @ts-ignore
import { initMDB, Tab } from 'mdb-ui-kit'

import { CustomElement, defineComponent } from '../utils'

import componentTemplate from './list-with-filters.html'
import './list-with-filters.scss'


export interface AppComponentProps {
  title: string;
}

class ListWithFilterComponent extends CustomElement<AppComponentProps> implements AppComponentProps {
  public static observedAttributes = [ 'title' ] as const
  
  public set title(title: string) {
    this.template.innerText = `Hello ${ title }!`
  }
  
  public get title(): string {
    return this.getAttribute('title') || ''
  }
  
  public constructor() { super(componentTemplate) }
  
}

export const ListWithFilters = defineComponent('list-with-filters', ListWithFilterComponent)
