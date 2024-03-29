import { Form, useObserver } from "Form/index";
import { Validator, useFormValidator, useRuleValidator } from "Validator/index";
import { useFieldReader, useFieldTrigger } from "Process/index";
import { FKeys, useKeys } from "FKeys/index";

export {
  Form,
  useObserver,
  FKeys,
  useKeys,
  Validator,
  useFormValidator,
  useRuleValidator,
  useFieldReader,
  useFieldTrigger,
};
import { Valid } from "Validator/index";
import type { Key, Keys } from "FKeys/index";
export type { Key, Keys, Valid };
export function FormValidator({ children }) {
  return (
    <Form>
      <Validator>{children}</Validator>
    </Form>
  );
}
export function useFieldState<V = any>(
  keys?: Keys,
  validator?: Valid
): [
  ReturnType<typeof useFieldReader<V>>,
  ReturnType<typeof useFieldTrigger<V>>,
  ReturnType<typeof useRuleValidator>
] {
  const value = useFieldReader<V>(keys);
  const onChange = useFieldTrigger<V>(keys);
  const errResponse = useRuleValidator(validator, keys);
  return [value, onChange, errResponse];
}

import forwardForm from "HOC/forwardForm/index";
import withInput from "HOC/withInput/index";
export { forwardForm, withInput };
