export abstract class CustomElement<Props = {}> extends HTMLElement {
  protected attributeChangedCallback(name: keyof Props, _: null | string, value: Props[keyof Props]): void {
    try {
      (this as unknown as Props)[name] = value
    } catch (e) {
      console.error('CustomElement.attributeChangedCallback', { name, value }, e)
    }
  }
  
  protected readonly template: HTMLDivElement
  
  protected constructor(template: string) {
    super()
    
    this.template = createTemplate(template)
  }
  
  protected connectedCallback(): void {
    this.append(...Array.from(this.template.children))
  }
}

export function defineComponent(tag: string, Component: CustomElementConstructor) {
  if (customElements.get(tag)) {
    location.reload()
  }
  
  customElements.define(tag, Component)
  
  return tag
}

export function createTemplate(template: string): HTMLDivElement {
  const container = document.createElement('div')
  
  container.innerHTML = template
  
  return container
}
