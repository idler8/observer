import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import {
  Form,
  useFieldReader,
  useFieldTrigger,
  useFormValidator,
  useRuleValidator,
} from "index";

test("表单验证", async () => {
  const handleResponse: { value?: any; errors?: any[] } = {};
  function isSuccess(values) {
    if (values?.fieldKey?.fieldObjectKey !== "Success") {
      return "Fail";
    }
  }
  function Value() {
    const validator = useFormValidator();
    const valResponse = useFieldReader(["fieldKey", "fieldObjectKey"]);
    const errResponse = useRuleValidator(isSuccess);
    const onChange = useFieldTrigger(["fieldKey", "fieldObjectKey"]);
    const onClick = () => {
      validator()
        .then((value) => {
          handleResponse.value = value;
          handleResponse.errors = undefined;
        })
        .catch((errors) => {
          handleResponse.value = undefined;
          handleResponse.errors = errors;
        });
    };
    return (
      <div>
        <div role="valueContainer">{valResponse || "InitValue"}</div>
        <div role="errorContainer">{errResponse || "InitError"}</div>
        <button onClick={() => onChange("Fail")} role="btnError">
          设定一个错误值
        </button>
        <button onClick={() => onChange("Success")} role="btnSuccess">
          设定一个正确值
        </button>
        <button onClick={onClick} role="btnResponse">
          验证结果
        </button>
      </div>
    );
  }
  render(
    <Form>
      <Value />
    </Form>
  );
  // 检查初始值
  await screen.findByRole("valueContainer");
  expect(screen.getByRole("valueContainer")).toHaveTextContent("InitValue");
  await screen.findByRole("errorContainer");
  expect(screen.getByRole("errorContainer")).toHaveTextContent("InitError");
  expect(handleResponse.value).toBeUndefined();
  expect(handleResponse.errors).toBeUndefined();
  // 设定一个错误值
  await screen.findByRole("btnError");
  await userEvent.click(screen.getByRole("btnError"));
  await screen.findByRole("valueContainer");
  expect(screen.getByRole("valueContainer")).toHaveTextContent("Fail");
  await screen.findByRole("errorContainer");
  expect(screen.getByRole("errorContainer")).toHaveTextContent("InitError");
  expect(handleResponse.value).toBeUndefined();
  expect(handleResponse.errors).toBeUndefined();
  // 验证并检查错误结果
  await screen.findByRole("btnResponse");
  await userEvent.click(screen.getByRole("btnResponse"));
  expect(screen.getByRole("valueContainer")).toHaveTextContent("Fail");
  expect(screen.getByRole("errorContainer")).toHaveTextContent("Fail");
  expect(handleResponse.value).toBeUndefined();
  expect(handleResponse.errors).toEqual(["Fail"]);
  // 设定一个正确值
  await screen.findByRole("btnSuccess");
  await userEvent.click(screen.getByRole("btnSuccess"));
  expect(screen.getByRole("valueContainer")).toHaveTextContent("Success");
  expect(screen.getByRole("errorContainer")).toHaveTextContent("InitError");
  expect(handleResponse.value).toBeUndefined();
  expect(handleResponse.errors).toEqual(["Fail"]);
  // 验证并检查正确结果
  await screen.findByRole("btnResponse");
  await userEvent.click(screen.getByRole("btnResponse"));
  expect(screen.getByRole("valueContainer")).toHaveTextContent("Success");
  expect(screen.getByRole("errorContainer")).toHaveTextContent("InitError");
  const Success = { fieldKey: { fieldObjectKey: "Success" } };
  expect(handleResponse.value).toEqual(Success);
  expect(handleResponse.errors).toBeUndefined();
});
