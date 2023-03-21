export type Key = string | number
export type Callback<V = any> = (value: V) => any
export type UnListener = () => void;
export type Listener<C = Callback<any>> = (callback: C) => UnListener
export type Filter = (value: any, index: number, array: any[]) => boolean
export type Callbacks<V> = {
  addCallback: (callback: Callback<V>) => UnListener,
  removeCallback: (callback: Callback<V>) => void,
  calls: Callback<V>,
  filter: (filter: Filter) => Callbacks<V>
}
export type Observer<V = any> = {
  keyCheck: (key: Key) => boolean,
  get: () => V,
  set: (value: V) => void,
  dataGet: () => V,
  dataSet: (value: V) => void,
  getChildValue: (value: any) => V,
  getChildren: (key: Key) => Observer,
  addCallback: Listener<Callback<V>>,
  addWatcher: (key: Key[], callback: Callback<V>) => UnListener,
  checkout: (key: Key[]) => Observer

  callRecursively: () => void,
  callChildren: (oldValue: any) => void,
}
export type Source<V = any> = {
  set: (value: V) => void,
  get: () => V,
}
export type createChildObserver<V = any> = (key: Key, parent: Observer) => Observer<V>
export type createRootObserver<V = any> = (data: V) => Observer<V>

export function createCallbacks<V = any>(callbacks: Callback<V>[] = []): Callbacks<V> {
  const removeCallback = (callback: Callback<V>) => {
    const index = callbacks.indexOf(callback)
    if (index === -1) return;
    callbacks.splice(index, 1)
  }
  const addCallback = (callback: Callback<V>) => {
    callbacks.push(callback);
    return () => removeCallback(callback)
  }
  const calls = (value: V) => {
    return callbacks.map(callback => callback(value))
  }
  const filter = (filter: Filter) => {
    return createCallbacks<V>(callbacks.filter(filter));
  }
  return { addCallback, removeCallback, calls, filter }
}
export function createObserver<V = any>(options: { key: Key, parent?: Observer, data?: any }): Observer<V> {
  const { key, parent } = options;
  const children: Observer[] = [];
  const callbacks = createCallbacks()

  const newObserver: Observer<V> = {
    dataGet() {
      if (parent) return parent.dataGet()?.[key];
      return options.data
    },
    dataSet(value: V) {
      if (typeof value === 'function') value = value(newObserver.dataGet())
      if (parent) {
        const parentValue = parent.dataGet();
        if (typeof parentValue !== 'object') {
          const pValue = typeof key === 'number' ? [] : {};
          pValue[key] = value
          parent.dataSet(pValue)
        } else {
          parentValue[key] = value
        }
      } else {
        options.data = value;
      }
    },
    callRecursively() {
      parent?.callRecursively();
      callbacks.calls(newObserver.get());
    },
    getChildValue(values) {
      return values?.[key]
    },
    keyCheck(isKey: Key) {
      return key === isKey
    },
    callChildren(oldValue) {
      const newValue = newObserver.get();
      if (newValue !== oldValue) callbacks.calls(newValue);
      children.forEach((observer) => {
        observer.callChildren(observer.getChildValue(oldValue));
      })
    },
    getChildren: (key) => {
      const observer = children.find(e => e.keyCheck(key));
      if (observer) return observer;
      const childObserver = createObserver({ key, parent: newObserver })
      children.push(childObserver);
      return childObserver
    },
    addCallback: (callback) => callbacks.addCallback(callback),

    get() {
      return newObserver.dataGet();
    },
    set(newValue: V) {
      const oldValue = newObserver.dataGet();
      if (oldValue === newValue) return;
      newObserver.dataSet(newValue)
      parent?.callRecursively();
      newObserver.callChildren(oldValue)
    },
    checkout(keys) {
      return keys.reduce((observer: Observer, key) => observer.getChildren(key), newObserver)
    },
    addWatcher(keys, callback) {
      return newObserver.checkout(keys).addCallback(callback)
    }
  }
  return newObserver;
}
export function createRootObserver(data?: any) {
  return createObserver({ key: '__ROOT__', data })
}
export default createRootObserver