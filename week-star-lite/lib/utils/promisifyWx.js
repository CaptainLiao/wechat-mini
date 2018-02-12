/**
 * 将wx中的方法转换为Promise形式 (并添加Async后缀)
 */

function promisify(wxObj, methodName) {
  wxObj[methodName + 'Async'] = function(params) {
    return new Promise(function(resolve, reject) {
      wxObj[methodName](
        Object.assign(
          {},
          {
            success: resolve,
            fail: reject
          },
          params
        )
      )
    })
  }
}

function promisifyAll(obj) {
  for (var key in obj) {
    if (!(key in {}) && typeof obj[key] === 'function') {
      promisify(obj, key)
    }
  }
  return obj
}

module.exports = promisifyAll(wx)
