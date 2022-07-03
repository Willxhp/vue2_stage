const { initMixin } = require("./init")
const { initLifecycle } = require("./lifecycle")

function Vue(options) {
  this._init(options)
}

// initMixin函数主要用于向Vue原型对象上挂载属性
initMixin(Vue)
initLifecycle(Vue)

// export default Vue
window.Vue = Vue

// Vue的核心流程
/* 
  (1) 创造响应式数据 (2) 将模板转换成ast语法树 (3) 将ast语法树转换成render函数 (4) render函数会使用响应式数据产生虚拟节点
  (5) 根据生成的虚拟节点创造真实的DOM (6) 后续每次数据更新可以只执行render函数，无需再次执行ast转化的过程
*/