const signals = require('./signals')

let __state = {
  // 是否有管家身份
  authenticated: false,

  // 与当前小程序前端相关的所有状态
  wx: {
    // 是否授权UserInfo
    authorized: false
  }
}

signals.on('wx-authorized', () => {
  __state.wx.authorized = true
})

signals.on('authenticated', value => {
  __state.authenticated = value
})

module.exports = __state
