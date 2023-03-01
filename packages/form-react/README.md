# React 嵌套表单

## 常用例子

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

### 更多用法可以参考测试用例

- [ReactObserver 基本用法](./__tests__/index.tsx)
- [ReactObserver 嵌套数据](./__tests__/stack.tsx)
- [ReactObserver 表单验证](./__tests__/validator.tsx)

### 或者发起[ISSUE](https://github.com/idler8/observer/issues/new)提出问题
