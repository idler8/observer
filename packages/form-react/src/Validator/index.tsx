import { useObserver } from "Form/index";
import { mergeDependencyList, transformKeys } from "FKeys/index";
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

export type Valid = (
  context: any,
  deps: Key[]
) => string | undefined | null | Promise<string | undefined | null>;
export function Validator({ children }: { children: ReactNode }) {
  const validators = useMemo(() => createCallbacks(), []);
  return <Context.Provider value={validators}>{children}</Context.Provider>;
}
export function useFormValidator() {
  const observer = useObserver();
  const validators = useContext(Context);
  return useCallback(
    async (includeRule?: Valid[]) => {
      if (!observer) return;
      const values = observer.get();
      const theValidators = includeRule
        ? validators.filter((callback) =>
            includeRule.includes(callback.original)
          )
        : validators;
      const anyResponse = await Promise.all(theValidators.calls(values));
      const anyFailResponse = anyResponse.filter(Boolean);
      if (anyFailResponse.length > 0) throw anyFailResponse;
      return values;
    },
    [validators, observer]
  );
}
export function useRuleValidator(validator?: Valid, keys?: Keys) {
  const observer = useObserver();
  const validators = useContext(Context);
  const [throwable, setThrowable] = useState<string | undefined>();

  useEffect(() => {
    const theValidator = async (context: any) => {
      try {
        const response = await validator?.(context, transformKeys(keys));
        if (response) throw response;
      } catch (e) {
        setThrowable(e);
        return e;
      }
    };
    theValidator.original = validator;
    return validators.addCallback(theValidator);
  }, mergeDependencyList(keys, validator, validators));

  useEffect(() => {
    if (!observer) return;
    return observer.addWatcher(transformKeys(keys), () => {
      setThrowable(undefined);
    });
  }, mergeDependencyList(keys, observer));
  return throwable;
}
