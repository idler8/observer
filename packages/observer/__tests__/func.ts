import createRootObserver from "index";

it('函数式变化', function () {
  const originalValues = {}
  const observer = createRootObserver(originalValues);
  observer.set({ "anyField": [] });
  observer.set((oldValue) => ({ ...oldValue, "anyNewField": ["field1"] }));
  expect(observer.get()).toEqual({
    "anyField": [],
    "anyNewField": ["field1"]
  })
})