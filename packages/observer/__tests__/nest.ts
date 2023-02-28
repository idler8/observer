import createRootObserver from "index";

test('多级嵌套数据', function () {
  const values = { formKey: { fieldKey: 1 } };
  const observer = createRootObserver(values);
  const formObserver = observer.checkout(["formKey"]);
  const fieldObserver = formObserver.checkout(["fieldKey"]);
  expect(observer.checkout(["formKey", "fieldKey"])).toBe(fieldObserver)
  function valueCompare() {
    expect(observer.get()).toBe(values)
    expect(formObserver.get()).toBe(values.formKey)
    expect(fieldObserver.get()).toBe(values.formKey.fieldKey)
  }
  valueCompare();
  const handleValues = [];
  observer.addCallback(function (newValue) {
    handleValues.push("ROOT数据更新", newValue)
  });
  formObserver.addCallback(function (newValue) {
    handleValues.push("Form数据更新", newValue);
  });
  fieldObserver.addCallback(function (newValue) {
    handleValues.push("Field数据更新", newValue);
  });
  handleValues.length = 0;
  formObserver.set({ fieldKey: 2 });
  valueCompare();
  expect(observer.get()).toEqual({ formKey: { fieldKey: 2 } })
  expect(handleValues).toEqual([
    'ROOT数据更新', { formKey: { fieldKey: 2 } },
    'Form数据更新', { fieldKey: 2 },
    'Field数据更新', 2
  ])
  handleValues.length = 0;
  formObserver.set({ fieldKey: 2 });
  valueCompare();
  expect(observer.get()).toEqual({ formKey: { fieldKey: 2 } })
  expect(handleValues).toEqual([
    'ROOT数据更新', { formKey: { fieldKey: 2 } },
    'Form数据更新', { fieldKey: 2 }
  ])
})
