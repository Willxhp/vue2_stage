import { newArrayPrototype } from "./array"

class Observer{
  constructor(data) {
    // 将Observer实例对象挂载到数据对象上，且设置为不可枚举属性
    Object.defineProperty(data, '__ob__', {
      value: this // 此处this为Observer实例对象
    })
    if (Array.isArray(data)) {
      // 重写数组的方法
      Object.setPrototypeOf(data, newArrayPrototype)
      this.observeArray(data)
    } else {
      this.walk(data)
    }
  }
  walk(data) {
    // 遍历对象的所有属性，对每个属性进行重新定义
    Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
  }
  observeArray(data) {
    // 遍历数组，对每一项进行劫持
    // 不对数组的索引进行劫持，因为用户很少会通过索引来修改数据，而且数组中数据量往往较大，会浪费性能
    data.forEach(item => {observe(item)})
  }
}

// observe函数用于实现对数据的劫持
export function observe(data) {
  // 如果数据不是对象则直接返回
  if (typeof data !== 'object' || data == null) {
    return
  }
  // __ob__属性用来标记当前对象是否已经被劫持过
  if (data.__ob__ instanceof Observer) {
    return data.__ob__
  }
  return new Observer(data)
}

function defineReactive(data, key, value) { // 闭包
  // 属性值也有可能是对象，也需要对其进行递归劫持
  observe(value)
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newValue) {
      if (value == newValue) return
      // 新值可能是对象，需要进行劫持
      observe(newValue)
      value = newValue
    },
    configurable: true,
    enumerable: true
  })
}