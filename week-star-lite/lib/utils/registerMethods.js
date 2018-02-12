let uuid = 0

/**
 * 将child(任意Object)中的所有方法都暴露到parent上，使其最终能够被wxml的访问:
 *
 * Before:
 *   parent: {}
 *   child: { someFunc(){} }
 *
 * After regiserMethod(parent, child):
 *   parent: { 'method_0_someFunc': child.someFunc.bind(child) }
 *   child: { someFunc(), $someFunc: 'method_0_someFunc' }
 *
 * 特殊情况：如果继续registerMethod(grandParent, parent):
 *   grandparent: { 'method_0_someFunc': child.someFunc.bind(child)   }
 *   parent:  { 'method_0_someFunc': child.someFunc.bind(child)  }
 *   child: { someFunc(), $someFunc: 'method_0_someFunc' }
 *
 * @param {object} parent 任意对象
 * @param {object} child 任意对象
 * @param {string|number} id 方法的前缀id，用于避免命名冲突，不提供将使用自动生成的id
 */
function registerMethods(parent, child, id) {
  id = id || uuid++
  const prefix = str => ['method', id, str].join('_')
  const hasPrefix = str =>
    typeof str === 'string' && str.split('_')[0] === 'method'

  for (let key in child) {
    let element = child[key]
    if (child.hasOwnProperty(key) && typeof element === 'function') {
      if (hasPrefix(key)) {
        parent[key] = child[key]
      } else {
        const prefixed = prefix(key)
        parent[prefixed] = child[key].bind(child)
        child['$' + key] = prefixed
      }
    }
  }

  // 防止内存泄漏？
  // child.unregister = () => {
  //   Object.keys(child)
  //     .filter(
  //       propName => hasPrefix(child[propName]) && propName.indexOf('$') === 0
  //     )
  //     .map(propName => child[propName])
  //     .forEach(methodName => {
  //       console.log(methodName)
  //       parent[methodName] = null
  //     })
  // }

  return child
}

module.exports = registerMethods
