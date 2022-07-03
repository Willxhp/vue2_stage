// 解析模板用到的正则表达式
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\.)?${ncname})` 
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 匹配的是开始标签的开始，如<div，得到的分组是一个开始标签的标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配的是结束标签，得到的分组是结束标签的标签名
// 第一个分组是key，value值分别是分组3-5
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配标签属性
const startTagClose = /^\s*(\/?)>/ // 开始标签的结尾，可以匹配自闭合标签
// vue2中采用的是正则匹配的方式进行模板解析，而vue3中没有采用正则表达式

// 将模板字符串解析为AST抽象语法树
// 思路：先从模板字符串中利用正则表达式将开始标签、结束标签和文本内容全部截取出来，在开始标签处生成新的元素节点，并保存标签属性，、
// 在文本内容处创建文本节点
export function parseHTML(html) {
  const ELEMENT_TYPE = 1
  const TEXT_TYPE = 3
  const stack = [] // 栈用于存放元素
  let currentParent // 指向当前栈顶
  let root // 根节点

  // 创建节点
  function createASTElement(tag, attrs) {
    return {
      tag,
      type: ELEMENT_TYPE,
      children: [], // 默认无子元素
      attrs,
      parent: null // 默认父元素指向null
    }
  }
  // start chars和end分别对应开始标签、文本节点和结束标签的情况
  function start(tag, attrs) {
    let node = createASTElement(tag, attrs)
    if (!root) root = node // 如果没有根节点，则将当前节点当做根节点
    stack.push(node) // 将元素压栈
    if (currentParent) {
      currentParent.children.push(node) // 如果当前节点不是根节点，更新其父节点的children属性
      node.parent = currentParent // 更新当前节点的parent属性
    }
    currentParent = node // 更新栈顶元素的指向
  }
  function chars(text) { // 文本直接放到栈顶的children属性中
    text = text.replace(/\s/g, '')
    text && currentParent.children.push({
      type: TEXT_TYPE,
      text,
      parent:currentParent
    })
  }
  function end(tag) {
    stack.pop() // 可在此处校验标签名是否合法
    currentParent = stack[stack.length - 1]
  }
  // 将目标字符串截断
  function advance(n) {
    html = html.substring(n)
  }
  // 处理开始标签
  function parseStartTag() {
    // 匹配开始标签
    const start = html.match(startTagOpen)
    // 如果匹配到开始标签
    if (start) {
      // 创建一个对象用于保存标签信息
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length)
      let attr, end
      // 匹配到开始标签后一直匹配，直到匹配到开始标签的结束
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5] || true
        })
        advance(attr[0].length)
      }
      if (end) {
        advance(end[0].length)
      }
      return match
    }
    // 如果不是开始标签，则直接返回false
    return false
  }
  while(html) {
    let textEnd = html.indexOf('<')
    // 如果textEnd的值为0，说明目前字符串的开头是一个开始标签或结束标签
    if (textEnd == 0) {
      let startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      let endTagMatch =  html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch)
        continue
      }
    } 
    // 如果textEnd的值不为0，则textEnd的值就是文本结束的位置
    if (textEnd > 0) {
      // 截取文本内容
      let text = html.substring(0, textEnd)
      chars(text)
      advance(textEnd)
    }
  }
  return root
}