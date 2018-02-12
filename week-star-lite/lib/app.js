require('./utils/es6polyfill')
require('./utils/promisePolyfill').polyfill()
require('./utils/promisifyWx')
require('./init')
const { checkApi, polyfillWx } = require('./utils/checkApi')
const unsupportedApi = checkApi()
unsupportedApi.forEach(api => polyfillWx(api))
const logger = require('./utils/logger')

const systemInfo = wx.getSystemInfoSync() || {}
if (systemInfo.platform !== 'devtools') {
  const version = wx.getStorageSync('APP_VERSION')

  logger.hook(console, {
    getContext: () => ({
      version,
      openid: wx.getStorageSync('openid'),
      unionid: wx.getStorageSync('unionid'),
      pages: getCurrentPages().map(p => p.route),
      systemInfo
    })
  })
}

require('./base-data')

App({
  onLaunch() {
    if (unsupportedApi.length) {
      console.error('unsupported api:', unsupportedApi)
      wx.showModal({
        title: '抱歉',
        content: '您的微信版本过低，某些功能可能无法正常使用，建议更新至最新微信版本',
        showCancel: false
      })
    }
  },
  onError(e) {
    console.error('#uncaught', e)
  },

  MODEL: getModel()
})

// 方便设置各种屏幕的样式
function getModel() {
  const model = systemInfo.model
  if (/iphone x/i.test(model)) {
    return 'ipx'
  } else {
    // normal screen
    return ''
  }
}
