import componentTemplate from './app.html'

import { CustomElement, defineComponent } from './utils'
import './app.scss'


// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppComponentProps { /**/ }

class AppComponent extends CustomElement<AppComponentProps> implements AppComponentProps {
  public constructor() { super(componentTemplate) }
  
  protected override connectedCallback(): void {
    super.connectedCallback()
    
    const element = this.querySelector<HTMLInputElement>('#test-input')!;
    
    element.addEventListener('change', () => {
      this.updateList(element.value.split(''))
    })
  }
  
  private updateList(values: string[]): void {
    this.querySelector<HTMLUListElement>('#test-list')!.replaceChildren(...values.map(elementName => {
      const element = document.createElement('li');
      
      element.innerText = elementName;
      
      return element;
    }))
  }
}

export const App = defineComponent('app-root', AppComponent)
