const oldArrayPrototype =  Array.prototype
// newArrayPrototype.__proto__ = Array.prototype
// 新的数组原型对象
export const newArrayPrototype = Object.create(oldArrayPrototype)
// 七种待重写的数组方法
const methods = [
  'push',
  'shift',
  'unshift',
  'pop',
  'splice',
  'reverse',
  'sort'
]
methods.forEach(method => {
  newArrayPrototype[method] = function(...args) {
    // 实现数组原方法的功能，此处this指向方法的调用者
    let result = oldArrayPrototype[method].call(this, ...args)
    // 新增的内容
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break;
      case 'splice': 
        inserted = args.slice(2)
      default:
        break;
    }
    // 对新增的内容再次进行劫持
    if (inserted) {
      this.__ob__.observeArray(inserted)
    }
    return result
  }
})