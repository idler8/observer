import { useObserver } from "Form/index";
import { useCallback, useEffect, useState } from "react";
import { mergeDependencyList, transformKeys } from "FKeys/index";
import type { Keys } from 'Fkeys/index'


export function useFieldReader<V = any>(keys?: Keys) {
  const observer = useObserver();
  const [, tick] = useState(0)
  const [value, setValue] = useState<V>();
  useEffect(() => {
    if (!observer) return;
    const theObserver = observer.checkout(transformKeys(keys));
    setValue(theObserver.get())
    return theObserver.addCallback((value) => {
      setValue(value);
      tick((t) => t + 1)
    });
  }, mergeDependencyList(keys, observer));
  return value;
}
export function useFieldTrigger<V = any>(keys?: Keys) {
  const observer = useObserver();
  return useCallback(
    (value: V) => {
      if (!observer) return;
      observer.checkout(transformKeys(keys)).set(value);
    },
    mergeDependencyList(keys, observer)
  );
}