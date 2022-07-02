const { initMixin } = require("./init")

function Vue(options) {
  this._init(options)
}

// initMixin函数主要用于向Vue原型对象上挂载属性
initMixin(Vue)

// export default Vue
window.Vue = Vue