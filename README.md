# 数据观察者

使用发布/订阅模式的多层级数据管理机制

## 作者：[闲人](https://github.com/idler8)

## 功能清单

| 包名                 | 描述                  | 详细文档                                  |
| -------------------- | --------------------- | ----------------------------------------- |
| `@idler8/observer`   | 支持 ES3 的核心实现   | [传送门](./packages/core/README.md)       |
| `@idler8/form-react` | 支持 React 的嵌套表单 | [传送门](./packages/form-react/README.md) |

## 常用例子

### 核心库用法

```javascript
import { createRootObserver } from "@idler8/observer";
const values = { formKey: { fieldKey: 1 } };
const observer = createRootObserver(values);
const formObserver = observer.checkout(["formKey"]);
const fieldObserver = formObserver.checkout(["fieldKey"]);
console.log(fieldObserver === observer.checkout(["formKey", "fieldKey"])); // true
console.log(observer.get() === values); //true
console.log(formObserver.get() === values.formKey); //true
console.log(fieldObserver.get() === values.formKey.fieldKey); //true
observer.addCallback(function (newValue) {
  console.log("ROOT数据更新：", newValue);
});
formObserver.addCallback(function (newValue) {
  console.log("Form数据更新：", newValue);
});
fieldObserver.addCallback(function (newValue) {
  console.log("Field数据更新：", newValue);
});
formObserver.set({ fieldKey: 1 });
// console.log -> ROOT数据更新：{formKey:{fieldKey:1}}
// console.log -> Form数据更新：{fieldKey:1}
formObserver.set({ fieldKey: 2 });
// console.log -> ROOT数据更新：{formKey:{fieldKey:2}}
// console.log -> Form数据更新：{fieldKey:2}
// console.log -> Field数据更新：2
console.log(values.formKey.fieldKey === 2); // true
```

### React 表单用法

```javascript
import { Form, useFieldReader, useFieldTrigger } from "@idler8/form-react";
const Input = ({ value = "", onChange }) => (
  <input value={value} onChange={(e) => onChange?.(e.target.value)} />
);
const Field = ({ name }) => {
  const value = useFieldReader(name);
  const onChange = useFieldTrigger(name);
  return <Input value={value} onChange={onChange} />;
};
const Fields = () => {
  const value = useFieldReader();
  const onChange = useFieldTrigger();
  useEffect(() => {
    onChange({ formKey: { fieldKey: 2 } });
  }, []);
  return (
    <div>
      <div>{JSON.stringify(value)}</div>
      <Field name={["formKey", "fieldKey"]} />
    </div>
  );
};

ReactDOM.createRoot(document.getElelemtByID("root")).render(
  <Form>
    <Fields />
  </Form>
);
```
