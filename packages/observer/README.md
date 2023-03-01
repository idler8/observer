# 观察者核心

## 常用例子

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

### 更多用法可以参考测试用例

- [Observer 核心基本用法](./__tests__/index.ts)
- [Observer 核心嵌套数据](./__tests__/nest.ts)

### 或者发起[ISSUE](https://github.com/idler8/observer/issues/new)提出问题
