import { useObserver } from "Form/index";
import { useCallback, useEffect, useState } from "react";
import type { Keys } from "FKeys/index";

export function mergeDependencyList(observer, keys) {
  return keys ? (keys instanceof Array ? [observer, ...keys] : [observer, keys]) : [observer];
}
export function useFieldReader<V = any>(keys?: Keys) {
  const observer = useObserver();
  const [, tick] = useState(0)
  const [value, setValue] = useState<V>();
  useEffect(() => {
    if (!observer) return;
    const deps = keys ? (keys instanceof Array ? keys : [keys]) : [];
    const theObserver = observer.checkout(deps);
    setValue(theObserver.get())
    return theObserver.addCallback((value) => {
      setValue(value);
      tick((t) => t + 1)
    });
  }, mergeDependencyList(observer, keys));
  return value;
}
export function useFieldTrigger<V = any>(keys?: Keys) {
  const observer = useObserver();
  return useCallback(
    (value: V) => {
      if (!observer) return;
      const deps = keys ? (keys instanceof Array ? keys : [keys]) : [];
      observer.checkout(deps).set(value);
    },
    mergeDependencyList(observer, keys)
  );
}