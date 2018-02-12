function getIn(target, keyPath, notFoundValue = undefined) {
  for (let key of keyPath) {
    if (target && target.hasOwnProperty(key)) {
      target = target[key]
    } else {
      return notFoundValue
    }
  }

  return target
}

function get(target, keyPathStr, notFoundValue = undefined) {
  return getIn(target, keyPathStr.split('.'), notFoundValue)
}

function wait(t) {
  return new Promise(resolve => {
    setTimeout(resolve, t)
  })
}

function pick(obj, keys) {
  return keys.reduce((r, k) => {
    if (obj.hasOwnProperty(k)) {
      r[k] = obj[k]
    }
    return r
  }, {})
}

module.exports = {
  getIn,
  get,
  wait,
  pick
}
