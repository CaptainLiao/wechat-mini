const signals = require('../../signals')
const md5 = require('../../utils/md5')

let __openid = wx.getStorageSync('openid')
let __unionid = wx.getStorageSync('unionid')

signals.on('update-wx-id', ({ openid, unionid }) => {
  __openid = openid
  __unionid = unionid
})

const systemInfo = wx.getSystemInfoSync()
const defaultParams = {
  // uid: openid
  // imei: unionid
  // uuid: unionid
  client: 'weixinyee',
  source: 'weixin',
  platform: 'web',
  cver: '6.8',
  dver: '0',//'5.35',
  iver: '5.32',
  format: 'json'
}

function getPlatformOS() {
  let osParts = systemInfo.system.split(' ')

  if (osParts[0] === 'iOS') {
    return osParts.join('')
  } else {
    return osParts.join('.')
  }
}

defaultParams.p = [
  defaultParams.source,
  getPlatformOS(),
  defaultParams.client,
  defaultParams.cver,
  defaultParams.platform
].join(',')

function getCommonParams() {
  return Object.assign({
    uid: __openid || 'NO_UID',
    imei: __unionid || 'NO_IMEI',
    uuid: __unionid || 'NO_UUID',
    systemtime: new Date().getTime()
  }, defaultParams)
}

function generateSid(keys, obj, toUpper=true) {
  let s = keys.map(k => (obj[k])).join('')
  let e = md5(s + '')
  let sid = [2,24,6,18,9,19,8,11].map(i => (e[i])).join('')

  return toUpper ? sid.toUpperCase() : sid
}

module.exports = {
  getCommonParams,
  generateSid
}
