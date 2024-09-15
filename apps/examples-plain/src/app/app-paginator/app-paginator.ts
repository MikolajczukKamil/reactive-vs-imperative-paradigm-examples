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
  length: string = '';
  page: string = '';
  pagesize: string = '';
  pagesizes: string = '';
  
  public static observedAttributes = [ 'page', 'length', 'pagesize', 'pagesizes' ] as const
  
  //
  public constructor() { super(componentTemplate) }

  
  protected override connectedCallback(): void {
    super.connectedCallback()
  }
}

export const AppPaginator = defineComponent('app-paginator', AppPaginatorComponent)
