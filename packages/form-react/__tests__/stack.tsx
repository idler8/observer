import { findByRole, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Form, useFieldReader, useFieldTrigger } from "index";
import { useEffect, useState } from "react";

describe("列表数据控制", () => {
  test("堆内容变化", async () => {
    function Stack({ stack }) {
      return (
        <div>
          <div role="stack">{JSON.stringify(stack)}</div>
          <div>
            {stack?.map((value, index) => (
              <div key={index} role={"value-" + index}>
                {value}
              </div>
            ))}
          </div>
        </div>
      );
    }
    function Value() {
      const stack = useFieldReader(["stack"]);
      const onArrayChange = useFieldTrigger(["stack"]);
      useEffect(() => {
        onArrayChange([]);
      }, []);
      return (
        <>
          <Stack stack={stack} />
          <button
            role="push"
            onClick={() => {
              onArrayChange((oldValue) => [
                ...oldValue,
                "Value-" + oldValue.length,
              ]);
            }}
          />
          <button
            role="unshift"
            onClick={() => {
              onArrayChange(([first, ...oldValue]) => [...oldValue]);
            }}
          />
          <button
            role="splice"
            onClick={() => {
              onArrayChange((oldValue) => {
                oldValue.splice(1, 1);
                return [...oldValue];
              });
            }}
          />
        </>
      );
    }
    render(
      <Form>
        <Value />
      </Form>
    );
    await screen.findByRole("stack");
    expect(screen.getByRole("stack")).toHaveTextContent(JSON.stringify([]));
    await screen.findByRole("push");
    await userEvent.click(screen.getByRole("push"));
    expect(screen.getByRole("stack")).toHaveTextContent(
      JSON.stringify(["Value-0"])
    );
    expect(screen.getByRole("value-0")).toHaveTextContent("Value-0");
    await userEvent.click(screen.getByRole("push"));
    await userEvent.click(screen.getByRole("push"));
    await userEvent.click(screen.getByRole("push"));
    expect(screen.getByRole("stack")).toHaveTextContent(
      JSON.stringify(["Value-0", "Value-1", "Value-2", "Value-3"])
    );
    expect(screen.getByRole("value-1")).toHaveTextContent("Value-1");
    expect(screen.getByRole("value-2")).toHaveTextContent("Value-2");
    expect(screen.getByRole("value-3")).toHaveTextContent("Value-3");
    await userEvent.click(screen.getByRole("unshift"));
    expect(screen.getByRole("stack")).toHaveTextContent(
      JSON.stringify(["Value-1", "Value-2", "Value-3"])
    );
    expect(screen.getByRole("value-0")).toHaveTextContent("Value-1");
    expect(screen.getByRole("value-1")).toHaveTextContent("Value-2");
    expect(screen.getByRole("value-2")).toHaveTextContent("Value-3");
    await userEvent.click(screen.getByRole("splice"));
    expect(screen.getByRole("stack")).toHaveTextContent(
      JSON.stringify(["Value-1", "Value-3"])
    );
    expect(screen.getByRole("value-0")).toHaveTextContent("Value-1");
    expect(screen.getByRole("value-1")).toHaveTextContent("Value-3");
  });
  test("多级堆数据", async () => {
    function StackSecound({ index }) {
      const stack = useFieldReader(["stack", index]);
      const onArrayChange = useFieldTrigger(["stack", index]);
      return (
        <div>
          <div role={"stack-" + index}>{JSON.stringify(stack)}</div>
          <div>
            {stack?.map?.((value, i2) => (
              <div key={i2} role={"stack-" + index + "-" + i2}>
                {value}
              </div>
            ))}
          </div>
          <button
            role={"button-" + index}
            onClick={() => {
              onArrayChange((oldValue) =>
                oldValue
                  ? [...oldValue, "Value-" + index + "-0"]
                  : ["Value-" + index + "-0"]
              );
            }}
          />
        </div>
      );
    }
    function StackFirst() {
      const stack = useFieldReader(["stack"]);
      const onArrayChange = useFieldTrigger(["stack"]);
      return (
        <div>
          <div role={"stack"}>{JSON.stringify(stack)}</div>
          <div>
            {stack?.map?.((value, i2) => (
              <StackSecound key={i2} index={i2} />
            ))}
          </div>
          <button
            role="button"
            onClick={() => {
              onArrayChange((oldValue) =>
                oldValue ? [...oldValue, []] : [[]]
              );
            }}
          />
        </div>
      );
    }
    render(
      <Form>
        <StackFirst />
      </Form>
    );
    await screen.findByRole("stack");
    expect(screen.getByRole("stack")).toHaveTextContent("");
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button-0")).toBeInTheDocument();
    expect(screen.getByRole("stack")).toHaveTextContent(JSON.stringify([[]]));
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button-1")).toBeInTheDocument();
    expect(screen.getByRole("stack")).toHaveTextContent(
      JSON.stringify([[], []])
    );
    await userEvent.click(screen.getByRole("button-0"));
    expect(screen.getByRole("stack-0")).toHaveTextContent(
      JSON.stringify(["Value-0-0"])
    );
    expect(screen.getByRole("stack")).toHaveTextContent(
      JSON.stringify([["Value-0-0"], []])
    );
    await userEvent.click(screen.getByRole("button-1"));
    expect(screen.getByRole("stack-1")).toHaveTextContent(
      JSON.stringify(["Value-1-0"])
    );
    expect(screen.getByRole("stack")).toHaveTextContent(
      JSON.stringify([["Value-0-0"], ["Value-1-0"]])
    );
  });
});
