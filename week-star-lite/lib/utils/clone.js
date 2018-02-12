const type = require('./type')

function clone(o) {
  const t = type(o)
  if (t === 'object') {
    let cloned = {}
    for (var key in o) {
      cloned[key] = clone(o[key])
    }
    return cloned
  }
  if (t === 'array') {
    return o.map(clone)
  }
  return o
}

module.exports = clone
