// 使用以下命令检查项目用到的所有API
// pcregrep -Mroh 'wx[\s\n ]*\.\w+' app  | sed 's/Async//' | sed -E 's/(wx)? *.?//'  | sort | uniq

const noop = () => {}

// getsetting 已在调用前检查
const requiredApi = `canvasToTempFilePath
chooseImage
createCanvasContext
getStorageSync
getSystemInfoSync
getUserInfo
hideLoading
login
makePhoneCall
navigateBack
navigateTo
redirectTo
request
requestPayment
setNavigationBarTitle
setStorageSync
showLoading
showModal
uploadFile`
  .split('\n')
  .map(s => s.trim())
  .filter(Boolean)

// 返回不支持的API列表
const checkApi = () => requiredApi.filter(api => typeof wx[api] !== 'function')

const polyfillWx = api => {
  try {
    switch (api) {
      case 'showLoading':
        wx.showLoading = function showLoading({
          title,
          mask,
          success,
          fail,
          complete
        }) {
          return wx.showToast({
            title,
            icon: 'loading',
            duration: 1000 * 60, // 足够长的加载时间
            mask: true,
            success,
            fail,
            complete
          })
        }
        break
      case 'hideLoading':
        wx.hideLoading = function hideLoading() {
          wx.hideToast()
        }
        break
      case 'getStorageSync':
        wx.getStorageSync = noop
        break
      case 'setStorageSync':
        wx.setStorageSync = noop
        break
      default:
        console.warn('cannot polyfill: ' + api)
        break
    }
  } catch (error) {
    console.error('polyfill failed', error)
  }
}

module.exports.checkApi = checkApi

module.exports.polyfillWx = polyfillWx
