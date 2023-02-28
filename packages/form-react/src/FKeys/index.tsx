import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
export type Key = string | number;
export type Keys = Key[] | Key;
export function transformKeys(keys?: Keys) {
  return keys ? (keys instanceof Array ? keys : [keys]) : [];
}

const Context = createContext<Key[]>([]);
export function FKeys({ name, children }: { name: Keys; children: ReactNode }) {
  const keys = useKeys(name);
  return <Context.Provider value={keys}>{children}</Context.Provider>;
}
export function useKeys(keys?: Keys) {
  const prevKeys = useContext(Context);
  const nextKeys = useMemo(() => {
    if (!keys) return prevKeys;
    if (keys instanceof Array) return [...prevKeys, ...keys];
    return [...prevKeys, keys];
  }, [prevKeys, keys]);
  return nextKeys;
}

export default FKeys;
