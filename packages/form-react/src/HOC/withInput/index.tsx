import { Callback } from "@idler8/observer";
import { useFieldState, useKeys } from "index";
import type { Valid } from "index";
import type { ComponentType, FunctionComponent } from "react";
export default function withInput<InputProps>(
  Component: ComponentType<
    { value?: string; onChange?: Callback; validateMessage?: any } & InputProps
  >
): FunctionComponent<{ name?: string; rule?: Valid } & InputProps> {
  return function Wapper(props): JSX.Element {
    const { name, rule } = props;
    if (name === undefined) return <Component {...props} />;
    const keys = useKeys(name);
    const [value, onChange, validateMessage] = useFieldState(keys, rule);
    return (
      <Component
        value={value}
        onChange={onChange}
        validateMessage={validateMessage}
        {...props}
      />
    );
  };
}
