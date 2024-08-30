import { DependencyList, EffectCallback, useEffect, useRef } from 'react';


export function useDebouncedEffect(effect: EffectCallback, deps: DependencyList, delay: number) {
  const callback = useRef<EffectCallback>(effect);
  callback.current = effect;
  
  useEffect(() => {
    const handler = setTimeout(() => {
      callback.current?.();
    }, delay);
    
    return () => clearTimeout(handler);
  }, [ ...deps, delay ]);
}
