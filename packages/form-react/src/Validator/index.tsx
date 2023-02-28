import { useObserver } from "Form/index";
import { transformKeys } from "FKeys/index";
import type { Keys, Key } from "FKeys/index";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { createCallbacks } from "@idler8/observer";
const Context = createContext(createCallbacks());
export function Validator({ children }: { children: ReactNode }) {
  const validators = useMemo(() => createCallbacks(), []);
  return <Context.Provider value={validators}>{children}</Context.Provider>;
}
export function useFormValidator() {
  const observer = useObserver();
  const validators = useContext(Context);
  return useCallback(async () => {
    if (!observer) return;
    const values = observer.get();
    const anyResponse = await Promise.all(validators.calls(values));
    const anyFailResponse = anyResponse.filter(Boolean);
    if (anyFailResponse.length > 0) throw anyFailResponse;
    return values;
  }, [validators, observer]);
}
export function useRuleValidator(
  validator: (context: any, deps: Key[]) => any,
  keys?: Keys
) {
  const observer = useObserver();
  const validators = useContext(Context);
  const [throwable, setThrowable] = useState<string | undefined>();

  useEffect(() => {
    return validators.addCallback(async (context) => {
      try {
        const response = await validator(context, transformKeys(keys));
        if (response) throw response;
      } catch (e) {
        setThrowable(e);
        return e;
      }
    });
  }, [validators, validator, keys]);

  useEffect(() => {
    if (!observer) return;
    const deps = transformKeys(keys);
    return observer.addWatcher(deps, () => {
      setThrowable(undefined);
    });
  }, [observer, keys]);
  return throwable;
}
