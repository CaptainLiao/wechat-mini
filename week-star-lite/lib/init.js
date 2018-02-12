// NOTE:
// 版本格式为: <年><月><日>NNN
// 如果年月日与上个版本相同，则后3位加一，否则为000，方便直接比较
//
// LST_VERSION为最后兼容Storage的版本，如果从Storage里获取到的版本
// 比LST_VERSION小，则首先清空整个Storage
//
const APP_VERSION = '20180208000'
const LST_VERSION = '20180207001'
const ver = wx.getStorageSync('APP_VERSION')

if (!ver || ver < LST_VERSION) {
  wx.clearStorageSync()
}
if (ver !== APP_VERSION) {
  wx.setStorageSync('APP_VERSION', APP_VERSION)
}

const signals = require('./signals')
const { get_auth, register } = require('./request/index')
const withLoading = require('./utils/withLoading')

let __initialized = false

function init() {
  if (__initialized) {
    return
  }
  __initialized = true

  if (wx.getSettingAsync) {
    wx.getSettingAsync().then(r => {
      let authSetting = r.authSetting
      if (authSetting['scope.userInfo']) {
        signals.broadcast('wx-authorized')
      }
    })
  }

  withLoading(get_auth)({ auth: 'yes' })
    .catch(e => {
      console.warn('登录失败，尝试注册')
      wx.loginAsync().then(({ code }) => {
        // NOTE: 在弹框等待用户授权时，页面上的其他部分是无法交互的
        return wx.getUserInfoAsync().then(r => {
          // 用户同意授权身份
          signals.broadcast('wx-authorized')

          r.code = code
          return withLoading(register)(r)
        })
      })
    })
}

module.exports = init()
