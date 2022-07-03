import { createElementVNode, createTextVNode } from "./vdom";

function createEle(vnode) {
  let {tag, data, children, text} = vnode
  if (typeof tag == 'string') {
    vnode.el = document.createElement(tag)
  } else {
    vnode.el = document.createTextNode(text)
  }
}

function patch(oldVNode, vnode) {
  // 判断目前是处于初始渲染过程还是页面更新过程
  const isRealElement = oldVNode.nodeType
  if (isRealElement) {
    // 获取真实DOM元素
    const elm = oldVNode
    // 获取父元素
    const parentElm = elm.parentNode
    createEle(vnode)
  } else {
    // diff算法
  }
}


export function initLifecycle(Vue) {
  // 将虚拟DOM转化为真实DOM
  Vue.prototype._update = function(vnode) {
    const vm = this
    // el是当前页面上的真实DOM元素
    const el = vm.$el
    // patch函数既有初始化的功能，又有更新的功能
    patch(el, vnode)
  }
  // 生成虚拟DOM
  Vue.prototype._render = function() {
    // 调用生成的render函数
    return this.$options.render.call(this)
  }
  // _c函数的作用是创建元素节点
  Vue.prototype._c = function() {
    // 接收到的参数 标签名 属性对象 子元素
    return createElementVNode(this, ...arguments)
  }
  // _v函数的作用是创建文本节点
  Vue.prototype._v = function() {
    return createTextVNode(this, ...arguments)
  }
  // _s函数的作用是将{{}}插值语法中的表达式转换成真实数据
  Vue.prototype._s = function(value) {
    if (typeof value !== 'object') return value
    return JSON.stringify(value)
  }
}

export function mountComponent(vm, el){
  // 调用render方法产生虚拟DOM
  // 根据虚拟DOM产生真实的DOM
  vm.$el = el
  vm._update(vm._render())
}