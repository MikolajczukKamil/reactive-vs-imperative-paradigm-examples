import { initMDB, Tab } from 'mdb-ui-kit'

import componentTemplate from './app.html'

import { CustomElement, defineComponent } from './utils'
import './app.scss'
import './list-with-filters'


export interface AppComponentProps {
  title: string;
}

class AppComponent extends CustomElement<AppComponentProps> implements AppComponentProps {
  public constructor() { super(componentTemplate) }
  
  protected override connectedCallback(): void {
    super.connectedCallback()
    
    initMDB({ Tab })
  }
}

export const App = defineComponent('app-root', AppComponent)
