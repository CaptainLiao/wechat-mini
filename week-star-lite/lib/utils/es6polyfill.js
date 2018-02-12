// number
if (typeof Number.isNaN !== 'function') {
  console.info('[polyfill] adding isNaN')
  Number.isNaN = isNaN
}

// string
if (typeof String.prototype.includes !== 'function') {
  console.info('[polyfill] adding String.prototype.includes')
  String.prototype.includes = function(str) {
    return this.indexOf(str) !== -1
  }
}
if (typeof String.prototype.repeat !== 'function') {
  console.info('[polyfill] adding String.prototype.repeat')
  String.prototype.repeat = function(count) {
    let str = ''
    while (count--) str = str.concat(this)
    return str
  }
}

// array
if (typeof Array.prototype.find !== 'function') {
  console.info('[polyfill] adding Array.prototype.find')
  Array.prototype.find = function(predict) {
    let i = 0
    while (i < this.length && !predict(this[i], i)) i++
    return this[i]
  }
}
if (typeof Array.prototype.findIndex !== 'function') {
  console.info('[polyfill] adding Array.prototype.findIndex')
  Array.prototype.findIndex = function(predict) {
    let i = 0
    while (i < this.length && !predict(this[i], i)) i++
    return i === this.length ? -1 : i
  }
}
if (typeof Array.prototype.includes !== 'function') {
  console.info('[polyfill] adding Array.prototype.includes')
  Array.prototype.includes = function(toFind) {
    return this.indexOf(toFind) !== -1
  }
}
if (!Array.prototype.of) {
  // TODO
}

// object
if (typeof Object.assign !== 'function') {
  console.info('[polyfill] adding Object.assign')
  Object.assign = function(target, ...toMerge) {
    if (target == null) return target
    if (typeof target !== 'object') return target
    for (var index = 0; index < toMerge.length; index++) {
      var elem = toMerge[index]
      for (var key in elem) {
        if (elem.hasOwnProperty(key) && elem && typeof elem === 'object') {
          target[key] = elem[key]
        }
      }
    }
    return target
  }
}
