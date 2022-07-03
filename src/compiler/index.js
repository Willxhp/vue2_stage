import { parseHTML } from './parse'

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // 匹配{{}}，匹配得到的分组就是插值语法中的表达式

// 将属性转换成对象的形式
function genProps(attrs) {
  let str = ''
  attrs.forEach((attr) => {
    // style属性本身也要转换成对象的形式
    if (attr.name == 'style') {
      let obj = {}
      attr.value.split(';').forEach((item) => {
        let [key, value] = item.split(':')
        if (key) obj[key] = value
      })
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  })
  return `{${str.slice(0, -1)}}`
}

// 处理children属性
function gen(node) {
  if (node.type == 1) { // 如果是元素节点，递归调用genCode
    return genCode(node)
  } else {
    // 文本节点
    let text = node.text
    if (!defaultTagRE.exec(text)) {
      // 纯文本节点，不含{{}}插值表达式，直接返回
      return `_v(${JSON.stringify(text)})`
    } else {
      // 含有插值语法的文本节点
      let tokens = [] // tokens数组用于存放已经匹配过的文本
      let match // 匹配的结果
      defaultTagRE.lastIndex = 0 // 将正则表达式的lastIndex重置为0
      let lastIndex = 0 // 上一次匹配结果的末尾
      while(match = defaultTagRE.exec(text)) {
        let index = match.index // 匹配的位置
        if (index > lastIndex) {
          // lastIndex到index部分表示在插值语法之外的文本，直接放入tokens数组中
          tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        // 将{{}}中的表达式放入tokens数组中
        tokens.push(`_s(${match[1]})`)
        // 更新lastIndex
        lastIndex = index + match[0].length
      }
      // 当文本中的{{}}全部匹配完成后，可能还有一部分文本剩余
      if (lastIndex < text.length) {
        tokens.push(`_v${JSON.stringify(text.slice(lastIndex))}`)
      }
      return `_v(${tokens.join('+')})`
    }
  }
}

function genChildren(children) {
  return children.map((child) => gen(child)).join(',')
}

// 将抽象语法树转化成一段可以执行的代码
function genCode(ast) {
  let children = genChildren(ast.children)
  let code = `_c('${ast.tag}',${
    ast.attrs.length > 0 ? genProps(ast.attrs) : 'null'
  }${ast.children.length ? `,${children}` : ''})`
  return code
}

// 解析模板
export function compileToFunction(template) {
  // 1. 将template转换成AST抽象语法树
  let ast = parseHTML(template)
  // 2. 生成render方法，render方法执行后的返回结果就是虚拟DOM
  let code = genCode(ast)
  console.log(code)
  // _c('div',{id:"app",style:{"color":" blue","font-size":" 18px"}},_c('div',{style:{"color":" red","background-color":" white"}},_s(name)+_v"hello"),_c('span',null,_s(age)))
  // 模板引擎的实现原理就是with + new Function
  let render = new Function(`with(this){return ${code}}`)
  return render
}
