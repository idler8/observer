import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Form, useFieldState, useFormValidator } from "index";

test("useFieldState", async () => {
  function isSuccess(values, keys) {
    if (keys?.reduce((prev, key) => prev?.[key], values) !== "Success") {
      return `${keys.join(".")} not Success`;
    }
  }
  const handleValue = { value: null, isError: false };
  function FieldInput({ name }) {
    const [value, onChange, errResponse] = useFieldState(name, isSuccess);
    const validator = useFormValidator();
    return (
      <div>
        <div role="input">{JSON.stringify(value)}</div>
        <div role="error">{JSON.stringify(errResponse)}</div>
        <button
          role="button"
          onClick={() => onChange(value === "Success" ? "Fail" : "Success")}
        >
          操作
        </button>
        <button
          role="validator"
          onClick={() =>
            validator().then(
              (res) => {
                handleValue.value = res;
                handleValue.isError = false;
              },
              (err) => {
                handleValue.value = err;
                handleValue.isError = true;
              }
            )
          }
        >
          验证
        </button>
      </div>
    );
  }
  render(
    <Form>
      <FieldInput name={["formKey", "fieldKey"]} />
    </Form>
  );
  await screen.findByRole("button");
  await userEvent.click(screen.getByRole("button"));
  await userEvent.click(screen.getByRole("validator"));
  expect(screen.getByRole("input")).toHaveTextContent(
    JSON.stringify("Success")
  );
  expect(screen.getByRole("error")).toHaveTextContent("");
  expect(handleValue.value).toEqual({ formKey: { fieldKey: "Success" } });
  expect(handleValue.isError).toBe(false);
  await userEvent.click(screen.getByRole("button"));
  await userEvent.click(screen.getByRole("validator"));
  expect(screen.getByRole("input")).toHaveTextContent(JSON.stringify("Fail"));
  expect(screen.getByRole("error")).toHaveTextContent(
    JSON.stringify("formKey.fieldKey not Success")
  );
  expect(handleValue.value).toEqual(["formKey.fieldKey not Success"]);
  expect(handleValue.isError).toBe(true);
});
