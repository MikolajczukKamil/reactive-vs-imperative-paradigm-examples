import { FunctionComponent } from 'react'


export abstract class CustomElement<Props = {}> extends HTMLElement {
  protected attributeChangedCallback(name: keyof Props, _: null | string, value: Props[keyof Props]): void {
    try {
      (this as unknown as Props)[name] = value;
    } catch (e) {
      console.error('CustomElement.attributeChangedCallback', { name, value }, e);
    }
  }
  
  protected abstract connectedCallback(): void;
}

export function defineComponent(tag: string, Component: CustomElementConstructor) {
  if (customElements.get(tag)) {
    location.reload()
  }
  
  customElements.define(tag, Component)
  
  return tag;
}
