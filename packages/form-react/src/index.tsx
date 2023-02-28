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

import type { Key, Keys } from "FKeys/index";
export type { Key, Keys };
export function FormValidator({ children }) {
  return (
    <Form>
      <Validator>{children}</Validator>
    </Form>
  );
}
