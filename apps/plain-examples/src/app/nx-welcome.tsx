import { CustomElement, defineComponent } from './utils'


export interface NxWelcomeComponentProps {
  title: string;
}

class NxWelcomeComponent extends CustomElement implements NxWelcomeComponentProps {
  get title(): string {
    return this.attribute('title') || ''
  }
  
  protected override connectedCallback(): void {
    const p = document.createElement('p')
    p.innerText = `Hello ${ this.title }!`
    
    this.appendChild(p)
  }
}

export const NxWelcome = defineComponent<NxWelcomeComponentProps>('nx-welcome', NxWelcomeComponent)
