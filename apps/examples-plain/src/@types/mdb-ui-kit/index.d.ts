declare module 'mdb-ui-kit' {
  class Input {}
  
  class Tab {}
  
  class Ripple {}
  class Button {}
  
  export function initMDB(values: Record<string, Input | Tab | Ripple>): void;
}
