import { Form, Validator } from "index";
import type { ComponentType } from "react";

export default function forwardForm<IComponentProps>(
  Component: ComponentType<IComponentProps>,
  hasValidator: boolean = true
) {
  return hasValidator
    ? function FormValidatorForward(props: IComponentProps): JSX.Element {
        return (
          <Form>
            <Validator>
              <Component {...props} />
            </Validator>
          </Form>
        );
      }
    : function FormForward(props: IComponentProps) {
        return (
          <Form>
            <Component {...props} />
          </Form>
        );
      };
}
