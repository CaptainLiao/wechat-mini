const type = require('./type')
const clone = require('./clone')

const isObject = o => type(o) === 'object'

function deepAssignSingle(target, source) {
  if (!isObject(target) || !isObject(source)) return target

  return Object.keys(source).reduce((base, key) => {
    const bType = type(base[key])
    const sType = type(source[key])

    if (sType === 'object') {
      if (bType === 'object') {
        deepAssignSingle(base[key], source[key])
      } else if (bType === 'null' || bType === 'undefined') {
        base[key] = clone(source[key])
      } else
        throw new TypeError(
          `type mismatch: trying to assign object to ${bType} on property '${key}': ${JSON.stringify(
            { target, source }
          )}`
        )
    } else {
      base[key] = clone(source[key])
    }
    return base
  }, target)
}

function deepAssign(base, ...sources) {
  if (!isObject(base))
    throw new Error(
      'typeof of base should be object. received: ' + JSON.stringify(base)
    )
  return sources.filter(isObject).reduce(deepAssignSingle, base)
}

module.exports = deepAssign

// let base = { a: { b: 1, c: 'a', d: {f:4,e:5,g:6}, e: [1,2,3,4] } }

// let result = deepAssign(
//   base,
//   3,
//   '111',
//   [],
//   {
//     newProp: 7,
//     e:[2,2,3,4]
//   },
//   {
//     newProp: 8,
//     newProp2: 9,
//     a: {
//       b:3,
//       d: { e: 'a', h: {r:'1'}}
//       // c: {}
//     }
//   }
// )

// console.log(result)
