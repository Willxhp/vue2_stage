export function createElementVNode(vm, tag, data, ...children) {
  if (!data) data = {}
  // 获取元素节点的key属性
  let key = data.key
  if (key) delete data[key]
  return vnode(vm, tag, key, data, children)
}
export function createTextVNode(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text)
}

// 生成虚拟节点，类似ast抽象语法树
// ast抽象语法树做的是语法层面的转化，描述的是语法本身
// 虚拟DOM描述的是DOM元素，可以增加一些自定义属性
function vnode(vm, tag, key, data, children, text) {
  return {
    vm,
    tag,
    key,
    data,
    children,
    text
  }
}