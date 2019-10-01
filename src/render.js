class Element {
  constructor(type, props, children) {
    this.type = type
    this.props = props
    this.children = children
  }
}

function createVirtualElement(type, props, children) {
  return new Element(type, props, children)
}

// 渲染对应的dom节点
function renderDom(obj) {
  let node = document.createElement(obj.type.toLowerCase())
  for(let i in obj.props) {
    setAttr(node, i, obj.props[i])
  }
  
  obj.children.forEach(child => {
    child = (child instanceof Element) ? renderDom(child) : document.createTextNode(child);
    try {
      node.appendChild(child);
    } catch(e) {
      console.log(e)
    }
  });

  return node;
}

function setAttr(node, key, val) {
  switch(key) {
    case 'value':
          // node是一个input或者textarea就直接设置其value即可
          if (node.tagName.toLowerCase() === 'input' ||
              node.tagName.toLowerCase() === 'textarea') {
              node.value = val;
          } else {
              node.setAttribute(key, val);
          }
          break;
      case 'style':
          // 直接赋值行内样式
          node.style.cssText = val;
          break;
      case 'className':
          node.className = val
          break;
      default:
        // 注意一个细节就是className，不能通过直接的setAtrribute来输出。
          node.setAttribute(key, val);
          break;
  }
}

// 挂载到对应的函数上
export  {
  Element,
  createVirtualElement,
  setAttr,
  renderDom
}