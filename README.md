# 数据观察者(Observer)

[English](./docs/English.md) | 中文

使用发布/订阅模式的多层级数据管理机制

![Github Build Status](https://github.com/idler8/observer/actions/workflows/npm-publish.yml/badge.svg)

## 作者：[闲人](https://github.com/idler8)

- ### 特点：

  - 简单：极少的代码内容，一眼看穿全部，打包后不到 1KB
  - 健壮：使用 Typescript 开发，完整的类型描述，方便自动补完
  - 安全：大量测试用例进行多场景覆盖
  - 自由：满足你的所有自定义需要

- ### 适用于：

  - 对 ant-design 的表单设计不满意，需要高度自定义表单界面的同学
  - 开发 React 时，需要设计嵌套表单的同学
  - 想要模拟 Vue 双向绑定的同学
  - 需要在不支持 ES5 的环境下开发数据表单的同学
  - 需要灵活的数据储存结构的同学

## 功能清单

| 包名                 | 描述                  | 健壮性                                                    | 下载量                                                | 详细文档                                  |
| -------------------- | --------------------- | --------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------- |
| `@idler8/observer`   | 支持 ES3 的核心实现   | ![types](https://badgen.net/npm/types/@idler8/observer)   | ![size](https://badgen.net/npm/dt/@idler8/observer)   | [传送门](./packages/observer/README.md)   |
| `@idler8/form-react` | 支持 React 的嵌套表单 | ![types](https://badgen.net/npm/types/@idler8/form-react) | ![size](https://badgen.net/npm/dt/@idler8/form-react) | [传送门](./packages/form-react/README.md) |

## 安装方式

```
yarn add @idler8/form-react
```

```
npm install @idler8/form-react
```

```html
<script src="https://unpkg.com/@idler8/observer"></script>
```

## 基本用例

```javascript
import Form, { useFieldState, useFormValidator } from "@idler8/form-react";
function isSuccess(values, keys) {
  const value = keys.reduce(function (prev, key) {
    return prev?.[key];
  }, values);
  if (value !== "Success") return keys.join(".") + " not Success";
}
function CustomInput({ name }) {
  const [value, onChange, errResponse] = useFieldState(name, isSuccess);
  if (errResponse) return <div>Error：{errResponse}</div>;
  return (
    <input value={value || ""} onChange={(e) => onChange(e.target.value)} />
  );
}
function Validator() {
  const validator = useFormValidator();
  const handleSubmit = () => {
    validator()
      .then((values) => {
        console.log("表单数据：", JSON.stringify(values));
      })
      .catch((errors) => {
        console.log("出错了,错误信息是：", JSON.stringify(errors));
        // ["formKey.formFieldKey not Success"]
      });
  };
  return <button onClick={handleSubmit}>验证数据</button>;
}
function PageComponent() {
  return (
    <Form>
      <CustomInput name="fieldKey" />
      <CustomInput name={["formKey", "formFieldKey"]} />
      <Validator />
    </Form>
  );
}
```

#### 例子：[在 Html 网站上使用](./example/observer-in-html/index.html)

#### 例子：[与 Ant-Design 一起使用](./example/form-react-replace-rcfieldform/index.html)

#### 查看测试用例学习更多用法

## 归档预告

本品正在尝试开源，上线时间为 2023-03-01，在 2023-06-01 之前不能获得用户认可并收到 20 个星星，作者将会归档本项目。  
在此期间，作者会积极维护本产品，欢迎体验。
