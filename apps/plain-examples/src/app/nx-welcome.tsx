import { CustomElement, defineComponent } from './utils'


export interface NxWelcomeComponentProps {
  title: string;
}

class NxWelcomeComponent extends CustomElement<NxWelcomeComponentProps> implements NxWelcomeComponentProps {
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

export const NxWelcome = defineComponent<NxWelcomeComponentProps>('nx-welcome', NxWelcomeComponent)
