import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { useFormValidator, useObserver } from "index";
import forwardForm from "HOC/forwardForm";
import withInput from "HOC/withInput";

test("forwardForm", async () => {
  const handleObserver = { ob1: null, ob2: null };
  function Value({ oKey }) {
    handleObserver[oKey] = useObserver();
    return null;
  }
  const FormValue = forwardForm(Value);

  render(
    <div>
      <Value oKey="ob1" />
      <FormValue oKey="ob2" />
    </div>
  );

  expect(handleObserver.ob1.keyCheck("__ROOT__")).toBe(true);
  expect(handleObserver.ob2.keyCheck("__ROOT__")).toBe(true);
  expect(handleObserver.ob1).not.toBe(handleObserver.ob2);
});

test("withInput", async () => {
  function isSuccess(values, keys) {
    if (keys?.reduce((prev, key) => prev?.[key], values) !== "Success") {
      return `${keys.join(".")} not Success`;
    }
  }
  function Value({
    value,
    onChange,
    validateMessage,
  }: {
    value?: any;
    onChange?: any;
    validateMessage?: any;
  }) {
    const validator = useFormValidator();
    return (
      <div>
        <div role="value">{JSON.stringify(value)}</div>
        <div role="error">{JSON.stringify(validateMessage)}</div>
        <button role="onChange" onClick={() => onChange("fieldValue")}>
          操作
        </button>
        <button
          role="validator"
          onClick={() => {
            validator().then(
              () => {},
              () => {}
            );
          }}
        >
          验证
        </button>
      </div>
    );
  }
  const FieldValue = withInput(Value);
  render(<FieldValue name="fieldKey" rule={isSuccess} />);
  await screen.findByRole("value");
  expect(screen.getByRole("value")).toHaveTextContent("");
  expect(screen.getByRole("error")).toHaveTextContent("");
  await userEvent.click(screen.getByRole("onChange"));
  expect(screen.getByRole("value")).toHaveTextContent(
    JSON.stringify("fieldValue")
  );
  await userEvent.click(screen.getByRole("validator"));
  expect(screen.getByRole("error")).toHaveTextContent(
    JSON.stringify("fieldKey not Success")
  );
});
