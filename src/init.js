import { initState } from './state'
import { compileToFunction } from './compiler/index'

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    // 将配置对象挂载到Vue实例上
    vm.$options = options
    // 初始化状态
    initState(vm)

    if (options.el) {
      vm.$mount(options.el)
    }
  }
  Vue.prototype.$mount = function (el) {
    const vm = this
    el = document.querySelector(el)
    // 获取配置对象
    let ops = vm.$options
    if (!ops.render) {
      // 先判断配置对象上有无render函数
      let template
      if (!ops.template && el) {
        // 如果配置对象上没有template属性，则以el指定的模板为准
        template = el.outerHTML
      } else if (ops.template) {
        // 如果配置对象上存在template属性，则采用template作为模板
        template = ops.template
      }
      if (template) {
        const render = compileToFunction(template)
        ops.render = render
      }
    }
    // 如果配置对象上有render函数，则直接获取render函数
    // ops.render
  }
}
