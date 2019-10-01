import { Element, renderDom, setAttr } from './render';

// 传入的patches的数据结构是对象，对象的children属性又是一个数组和对象，所以了解了数据结构只要实现遍历即可
// 也就是编程范式游记中说的，控制语句执行的是控制语句，业务逻辑是业务逻辑，抽象开来即可

// 控制打补丁
function controlPatch(node, patches) {
  if(patches.type) {
    doPatch(node, patches)
  }else if(patches.children.length > 0) {
    // 一个失误是原本是在旧的dom节点基础上修改，就不应该从新的virtual中生成补丁
    // 不然的话只需要按照条件执行即可，不过现在只能通过遍历patches来解决，只需要在doPatch中加上对于undefined的处理
    patches.children.forEach((child, index) => {
      // 有一个问题未解决就是删除的节点
      if(!node.childNodes[index]) {
        let newNode = patches.dom;
        newNode = (newNode instanceof Element) ? renderDom(newNode) : document.createTextNode(newNode);
        node.appendChild(newNode)
      }else {
        controlPatch(node.childNodes[index], child)
      }
    })
  }
}


function doPatch(node, patch) {
    // 遍历所有打过的补丁
        switch (patch.type) {
          case 'ATTR':
              for (let key in patch.attr) {
                  let value = patch.attr[key];
                  if (value) {
                      setAttr(node, key, value);
                  } else {
                      node.removeAttribute(key);
                  }
              }
              break;
          case 'TEXT':
              node.textContent = patch.text;
              break;
          case 'REPLACE':
              let newNode = patch.newNode;
              newNode = (newNode instanceof Element) ? renderDom(newNode) : document.createTextNode(newNode);
              node.parentNode.replaceChild(newNode, node);
              break;
          case 'REMOVE':
              node.parentNode.removeChild(node);
              break;
          default:
              break;
      }
}

export default controlPatch;
