import { createRootObserver, Observer } from "index";

describe('基本测试', function () {
  describe('createRootObserver', function () {
    it('不会造成对象变化', function () {
      const originalValues = { formKey: { fieldKey: 'fieldValue' } }
      createRootObserver(originalValues);
      expect(originalValues).toEqual({ formKey: { fieldKey: 'fieldValue' } })
    })
  })
  describe('Observer.get', function () {
    it('不会造成对象变化', function () {
      const originalValues = { formKey: { fieldKey: 'fieldValue' } }
      const observer = createRootObserver(originalValues);
      observer.get();
      expect(originalValues).toEqual({ formKey: { fieldKey: 'fieldValue' } })
    })
    it('获取数据', function () {
      const originalValues = { formKey: { fieldKey: 'fieldValue' } }
      const observer = createRootObserver(originalValues);
      const value = observer.get();
      expect(originalValues).toBe(value)
    })
  })
  describe('Observer.getChildren', function () {
    it('不会造成对象变化', function () {
      const originalValues = { formKey: { fieldKey: 'fieldValue' } }
      const observer = createRootObserver(originalValues);
      observer.getChildren('formKey');
      expect(originalValues).toEqual({ formKey: { fieldKey: 'fieldValue' } })
    })
    it('获取子对象', function () {
      const originalValues = { formKey: { fieldKey: 'fieldValue' } }
      const observer = createRootObserver(originalValues);
      expect(observer.getChildren('formKey').get()).toBe(originalValues.formKey)
    })
  })
  describe('Observer.checkout', function () {
    it('不会造成对象变化', function () {
      const originalValues = { formKey: { fieldKey: 'fieldValue' } }
      const observer = createRootObserver(originalValues);
      observer.checkout(['formKey']);
      expect(originalValues).toEqual({ formKey: { fieldKey: 'fieldValue' } })
    })
    it('等同于getChildren递归', function () {
      const originalValues = { formKey: { fieldKey: { fieldObjectKey: 'fieldValue' } } }
      const observer = createRootObserver(originalValues);
      const formObserver = observer.checkout(['formKey'])
      const childFormObserver = observer.getChildren('formKey')
      expect(formObserver).toBe(childFormObserver)
    })
  })
  describe('Observer.set', function () {
    it('修改数据', function () {
      const originalValues = { formKey: { fieldKey: 'fieldValue' } }
      const observer: Observer = createRootObserver(originalValues);
      const targetValue = { formKey2: { fieldKey2: 'fieldValue2' } }
      observer.set(targetValue)
      expect(observer.get()).toBe(targetValue)
    })
  })
  describe('Observer.addWatcher', function () {
    it('不会造成对象变化', function () {
      const originalValues = { formKey: { fieldKey: 'fieldValue' } }
      const observer = createRootObserver(originalValues);
      observer.addWatcher(['formKey'], () => { });
      expect(originalValues).toEqual({ formKey: { fieldKey: 'fieldValue' } })
    })
    it('简单监听', function () {
      const handleValues = { exec: 0 }
      const originalValues = { formKey: { fieldKey: 'fieldValue' } }
      const observer = createRootObserver(originalValues);
      const destory = observer.addWatcher(['formKey'], () => {
        handleValues.exec += 1;
      });
      observer.checkout(['formKey']).set({ fieldKey1: 'fieldValue1' });
      expect(handleValues.exec).toBe(1)
      destory();
      observer.checkout(['formKey']).set({ fieldKey2: 'fieldValue2' });
      expect(handleValues.exec).toBe(1)
    })
  })
})