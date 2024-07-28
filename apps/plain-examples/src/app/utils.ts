import { FunctionComponent } from 'react'


export abstract class CustomElement extends HTMLElement {
  protected attribute(name: string): undefined | string {
    return this.attributes.getNamedItem(name)?.value
  }
  
  protected abstract connectedCallback(): void;
}

export function defineComponent<Props>(tag: string, Component: CustomElementConstructor): FunctionComponent<Props> & string {
  if (customElements.get(tag)) {
    location.reload()
  }
  
  customElements.define(tag, Component)
  
  return tag as unknown as FunctionComponent<Props> & string
}
