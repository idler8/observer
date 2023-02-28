import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import {
  Form,
  useObserver,
  FKeys,
  useKeys,
  useFieldReader,
  useFieldTrigger,
  Keys,
} from "index";
import { useEffect } from "react";
import { Observer } from "../../observer/src/index";

test("基本渲染：React", async () => {
  render(
    <Form>
      <button role="button">Hello World</button>
    </Form>
  );
  await screen.findByRole("button");
  expect(screen.getByRole("button")).toHaveTextContent("Hello World");
});
describe("观察者", () => {
  test("全局表单", async () => {
    const observers: Observer[] = [];
    function Value() {
      const observer = useObserver();
      useEffect(() => {
        if (observers.indexOf(observer) === -1) observers.push(observer);
      }, [observer]);
      return null;
    }
    render(
      <div>
        <Value />
        <Value />
      </div>
    );
    expect(observers.filter((e) => e.keyCheck("__ROOT__")).length).toBe(1);
  });
  test("表单隔离", async () => {
    const observers: Observer[] = [];
    function Value() {
      const observer = useObserver();
      useEffect(() => {
        if (observers.indexOf(observer) === -1) observers.push(observer);
      }, [observer]);
      return null;
    }
    render(
      <div>
        <Form>
          <Value />
        </Form>
        <Form>
          <Value />
        </Form>
      </div>
    );
    expect(observers.filter((e) => e.keyCheck("__ROOT__")).length).toBe(2);
  });
});
describe("基本使用", () => {
  test("Fkeys和useKey", async () => {
    function Value({ name, role }: { name: Keys; role: string }) {
      return <button role={role}>{JSON.stringify(useKeys(name))}</button>;
    }
    render(
      <FKeys name="form">
        <Value name="fieldKey1" role="field1" />
        <Value name={["fieldKey2", "fieldObjectKey"]} role="field2" />
      </FKeys>
    );
    expect(screen.getByRole("field1")).toHaveTextContent(
      JSON.stringify(["form", "fieldKey1"])
    );
    expect(screen.getByRole("field2")).toHaveTextContent(
      JSON.stringify(["form", "fieldKey2", "fieldObjectKey"])
    );
  });
  test("useFieldReader和useFieldTrigger", async () => {
    function Value({ name, role }: { name: Keys; role: string }) {
      const value = useFieldReader(name);
      const onChange = useFieldTrigger(name);
      return (
        <button onClick={() => onChange(value ? value + 1 : 1)} role={role}>
          {JSON.stringify(value)}
        </button>
      );
    }
    render(<Value name="fieldKey1" role="field1" />);
    await screen.findByRole("field1");
    await userEvent.click(screen.getByRole("field1"));
    expect(screen.getByRole("field1")).toHaveTextContent(JSON.stringify(1));
    await userEvent.click(screen.getByRole("field1"));
    expect(screen.getByRole("field1")).toHaveTextContent(JSON.stringify(2));
  });
});
