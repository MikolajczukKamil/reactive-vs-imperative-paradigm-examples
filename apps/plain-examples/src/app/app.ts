import { CustomElement, defineComponent } from './utils'

import './app.module.scss'


export interface AppComponentProps {
  title: string;
}

class AppComponent extends CustomElement<AppComponentProps> implements AppComponentProps {
  public static observedAttributes = [ 'title' ] as const
  
  public set title(title: string) {
    this.p.innerText = `Hello ${ title }!`
  }
  
  public get title(): string {
    return this.getAttribute('title') || ''
  }
  
  private readonly p = document.createElement('p')
  
  protected override connectedCallback(): void {
    this.appendChild(this.p)
  }
}

export const App = defineComponent('app-root', AppComponent)
