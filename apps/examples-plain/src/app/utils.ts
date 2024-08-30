export abstract class CustomElement<Props = {}> extends HTMLElement {
  protected attributeChangedCallback(name: keyof Props, _: null | string, value: Props[keyof Props]): void {
    try {
      // console.debug({ [name]: value });
      
      (this as unknown as Props)[name] = value
    } catch (e) {
      console.error('CustomElement.attributeChangedCallback', { name, value }, e)
    }
  }
  
  protected readonly template: HTMLDivElement
  
  protected connected = false
  
  protected constructor(template: string) {
    super()
    
    this.template = createTemplate(template)
  }
  
  protected bindChangeValue(selector: string, bindingFn: (el: HTMLInputElement) => void): void {
    const element = this.querySelector<HTMLInputElement>(selector)!
    
    element.addEventListener('change', () => {
      bindingFn(element)
    })
  }
  
  querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
  querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
  querySelector<K extends keyof MathMLElementTagNameMap>(selectors: K): MathMLElementTagNameMap[K] | null;
  querySelector<K extends keyof HTMLElementDeprecatedTagNameMap>(selectors: K): HTMLElementDeprecatedTagNameMap[K] | null;
  querySelector<E extends Element = Element>(selectors: string): E | null;
  
  public override querySelector(selectors: string): Element | null {
    if (this.connected) {
      return super.querySelector(selectors)
    }
    
    return this.template.querySelector(selectors)
  }
  
  querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
  querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
  querySelectorAll<K extends keyof MathMLElementTagNameMap>(selectors: K): NodeListOf<MathMLElementTagNameMap[K]>;
  querySelectorAll<K extends keyof HTMLElementDeprecatedTagNameMap>(selectors: K): NodeListOf<HTMLElementDeprecatedTagNameMap[K]>;
  querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E>;
  
  public override querySelectorAll(selectors: string): NodeListOf<Element> {
    if (this.connected) {
      return super.querySelectorAll(selectors)
    }
    
    return this.template.querySelectorAll(selectors)
  }
  
  protected connectedCallback(): void {
    this.connected = true
    this.append(...Array.from(this.template.children))
  }
  
  protected disconnectedCallback(): void {}
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
