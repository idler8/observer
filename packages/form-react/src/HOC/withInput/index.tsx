import { Callback } from "@idler8/observer";
import { useFieldState } from "index";
import type { ComponentType, FunctionComponent } from "react";
export default function withInput<InputProps>(
  Component: ComponentType<
    { value?: string; onChange?: Callback; validateMessage?: any } & InputProps
  >
): FunctionComponent<{ name?: string; rule?: Function } & InputProps> {
  return function Wapper(props: InputProps): JSX.Element {
    if (props["name"] === undefined) return <Component {...props} />;
    const [value, onChange, validateMessage] = useFieldState(
      props["name"],
      props["rule"]
    );
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
