import { createRootObserver } from "@idler8/observer";
import type { Observer } from "@idler8/observer";
import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";

const Context = createContext<Observer>(createRootObserver());
export function Form({ children }: { children: ReactNode }) {
  const observer = useMemo(() => createRootObserver(), []);
  return <Context.Provider value={observer}>{children}</Context.Provider>;
}

export function useObserver() {
  return useContext(Context);
}

export default Form;
