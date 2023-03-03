import createRootObserver from "index";

it('数组变化', function () {
  const originalValues = {}
  const observer = createRootObserver(originalValues);
  observer.checkout(['formKey']).set([]);
  expect(observer.get()).toEqual({ "formKey": [] })
  observer.checkout(['formKey']).set([[]]);
  expect(observer.get()).toEqual({ "formKey": [[]] })
  observer.checkout(['formKey']).set([[], []]);
  expect(observer.get()).toEqual({ "formKey": [[], []] })
  observer.checkout(['formKey', 0]).set(['Value-0']);
  expect(observer.get()).toEqual({ "formKey": [['Value-0'], []] })
  expect(observer.checkout(['formKey']).get()).toEqual([['Value-0'], []])
  expect(observer.checkout(['formKey', 0]).get()).toEqual(['Value-0'])
  observer.checkout(['formKey', 1]).set(['Value-1']);
  expect(observer.get()).toEqual({ "formKey": [['Value-0'], ['Value-1']] })
  expect(observer.checkout(['formKey']).get()).toEqual([['Value-0'], ['Value-1']])
  expect(observer.checkout(['formKey', 1]).get()).toEqual(['Value-1'])
})
it('checkout时，键类型为数字，应该生成Array而不是Object', function () {
  const observer = createRootObserver({});
  observer.checkout(['arrayKey', 0]).set('array item 1');
  expect(observer.checkout(['arrayKey']).get()).toEqual(['array item 1'])
  observer.checkout(['objectKey', "0"]).set('object item 1');
  expect(observer.checkout(['objectKey']).get()).toEqual({ "0": "object item 1" })
})