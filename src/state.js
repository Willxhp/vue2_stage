import { observe } from "./observe"

// 初始化状态
export function initState(vm) {
  const ops = vm.$options
  if (ops.data) {
    initData(vm)
  }
}

// 初始化数据
function initData(vm) {
  let data = vm.$options.data
  data = typeof data === 'function' ? data.call(vm) : data
  // 将数据挂载到vm实例上
  vm._data = data
  // 对数据进行劫持
  observe(data)
  // 把vm._data上的属性都代理到vm上，便于数据的使用
  Object.keys(vm._data).forEach(key => {
    proxy(vm, '_data', key)
  })
}

function proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[target][key]
    },
    set(newValue) {
      vm[target][key] = newValue
    },
    enumerable: true,
    configurable: true
  })
}