function diffDom(oldTree, newTree) {
  // 先讲下基本的实现思路，就是在更新dom节点的时候
  // 对比新老节点，将更改记录下来，方便后续实现。
  // 比如记下第几个树的更改是啥，记录下类型，然后patch找到对应的树进行更改

    // 声明变量patches用来存放补丁的对象,仅有一个元素
    let patches = [];

    // 递归树 比较后的结果放到补丁里
    walk(newTree, oldTree, patches);

    // 既然只有一个元素就不要搞得太复杂了
    return patches[0];
}
// 替换或者生成的更改，从dom中取得对应到的节点。
// 文本更改从 text 中取得
// 属性更改从 attr 中取得

function walk( newNode, oldNode, patches) {
  // 应该在这个函数中就将所有的补丁都收集好

  if (!oldNode) { // rule1
    patches.push({ type: 'ADD',dom: newNode, children:[]});
  } else if (isString(oldNode) && isString(newNode)) {
      // 若是文本节点，则判断文本是否一致
      if (oldNode !== newNode) {
        patches.push({ type: 'TEXTCHANGE', text: newNode, children:[] });
      }

  } else if (oldNode.type === newNode.type) {
      // 比较属性是否有更改
      let attr = diffAttr(oldNode.props, newNode.props);
      if (Object.keys(attr).length > 0) {
        patches.push({ type: 'ATTR',attr, children:[] });
      }
      // 如果类型一致，则开始比对子节点,注意先判断下patches的length的长度，确保可以继续遍历
      diffChildren(oldNode.children, newNode.children, patches);
  } else {    // 说明节点被替换了
      patches.push({ type: 'REPLACE', dom: newNode, children:[]});
      // 若节点被替换则无需向下比较，直接更新
  }

  // 所以走到这个位置的时候就可以判定当前tree不存在更改
}

function isString(obj) {
  return typeof obj === 'string';
}

function diffAttr(oldAttrs, newAttrs) {
  let patch = {};
  // 判断老的属性中和新的属性的关系
  for (let key in oldAttrs) {
      if (oldAttrs[key] !== newAttrs[key]) {
          patch[key] = newAttrs[key]; // 主要是为了兼容属性删除的情况
      }
  }

  for (let key in newAttrs) {
      // 老节点没有新节点的属性
      if (!oldAttrs.hasOwnProperty(key)) {
          patch[key] = newAttrs[key];
      }
  }
  return patch;
}

function diffChildren(oldChildren, newChildren, patches) {
    // 比较老的第一个和新的第一个
    // 一个问题: 如果哦仅仅通过num来自加，怎么知道是第几个元素，所以这里的判断要自动去判断children，
    // 最好的方式是通过key值来标记，但是如果非遍历的话，其实没有必要了解，patch补丁的数据结构可以参照tree的结构
    // 最合理的方式是对newTree来遍历，从而对比旧的oldtree是否需要修改，毕竟更改是建立在newTree

    if(!patches.length) {
      patches.push({type: void(0), children:[]})
    }

    newChildren.forEach((child, index) => {
      // 将更改放入children中
      walk(child, oldChildren[index], patches.children);
    });
}


export {diffDom}

/*
理清下思路
diff算法在生成补丁的时候：
1. 先判断是否存在旧树，如果没有，则为新树，加入补丁，结束判断。
2. 在判断新旧子树是否为文本节点，如果是则判断值有无更改，有更改则加入补丁，结束判断。
3. 再判断节点的tagName是否一致，不一致说明父节点已经改变，全部内容重新修改。结束判断
4. 如果节点的tagName,未更改，则先对attr进行判断，计入补丁中，然后再对子节点进行判断，计入补丁的children中。
*/