let signals = {}

module.exports = {
  on(sig, fn) {
    (signals[sig] || (signals[sig] = [])).push(fn)
  },

  off(sig, fn) {
    let cbs = signals[sig]
    if (cbs) {
      for (let i = 0; i < cbs.length; i++) {
        if (cbs[i] === fn) {
          cbs.splice(i, 1)
          break
        }
      }
    }
  },

  broadcast(sig, data) {
    let cbs = signals[sig]
    if (cbs) {
      cbs = [].concat(cbs)
      for (let i = 0; i < cbs.length; i++) {
        cbs[i](data)
      }
    }
  },

  once(sig, fn) {
    let _on = (data) => {
      this.off(sig, _on)
      fn(data)
    }
    this.on(sig, _on)
  }
}
