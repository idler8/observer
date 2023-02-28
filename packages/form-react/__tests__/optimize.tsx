import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect, useState } from "react";
import { Form, useObserver } from "index";
import { mergeDependencyList } from "Process/index";

test("刷新次数检测", async () => {
  const handleValue = { tick: 0 };
  function OKeys({ keys, tick }) {
    const observer = useObserver();
    const deps = mergeDependencyList(observer, keys);
    useEffect(() => {
      handleValue.tick += 1;
    }, deps);
    return <div>{tick}</div>;
  }
  function Ticker() {
    const [tick, setTick] = useState(0);
    return (
      <div>
        <button role="button" onClick={() => setTick((t) => t + 1)} />
        <OKeys keys={["formKey", "fieldKey"]} tick={tick} />
      </div>
    );
  }
  render(
    <Form>
      <Ticker />
    </Form>
  );
  expect(handleValue.tick).toBe(1);
  await userEvent.click(screen.getByRole("button"));
  expect(handleValue.tick).toBe(1);
  await userEvent.click(screen.getByRole("button"));
  expect(handleValue.tick).toBe(1);
});
