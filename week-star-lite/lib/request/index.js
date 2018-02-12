const signals = require('../signals')
const { get } = require('../utils/index')
const base64 = require('../utils/base64')
const _ = require('../utils/datetime')
const transformers = require('./transformers/index')

let __compose = (host, options) => {
  return Promise.resolve(transformers[host](options))
    .then(opts => {
      return get_auth({
        auth: options.auth
      }).then(({ Authorization }) => {
        if (Authorization) {
          opts.header.Authorization = Authorization
        }
        return opts
      })
    })
}

let upload = host => options => {
  let { filePath, name } = options

  return __compose(host, options)
    .then(opts => {
      return wx.uploadFileAsync({
        url: opts.url,
        filePath,
        name,
        formData: opts.data
      })
    })
}

let request_h5 = (options) => {
  return __compose('h5', options)
    .then(opts => {
      return wx.requestAsync(opts)
    })
}

let request_hbgj = host => (options, retry = true) => {
  return __compose(host, options)
    .then(opts => {
      return wx.requestAsync(opts)
        .then(r => {
          let code = get(r, 'data.res.hd.code')

          // 模拟登陆态失效
          // if (Math.random() * 10 < 2) {
          //   console.log('[TEST] authorization expired')
          //   code = -401
          // }

          if (retry && (code == -401 || code == -402)) {
            let invalidAuth = opts.header.Authorization
            refresh_auth({ invalidAuth })
            return request_hbgj(host)(options, false)
          } else {
            return r
          }
        })
    })
}

let request_ticket = request_hbgj('ticket')
let request_pay = request_hbgj('pay')


// ------------------------------------------
// OPENID + UNIONID
function getWxId() {
  let openid = wx.getStorageSync('openid')
  let unionid = wx.getStorageSync('unionid')

  if (unionid) {
    return Promise.resolve({ openid, unionid })
  }

  return wx.loginAsync().then(({ code }) => {
    return request_ticket({
      auth: 'no',
      url: '/v3/user/login',
      method: 'POST',
      sidFields: ['uid','pid','code'],
      data: {
        pid: 41072,
        code
      }
    }, false)
  }).then(r => {
    let openid = get(r, 'data.res.bd.openid')
    let unionid = get(r, 'data.res.bd.unionid')

    if (openid) {
      wx.setStorageSync('openid', openid)
      wx.setStorageSync('unionid', unionid)

      signals.broadcast('update-wx-id', { openid, unionid })
    }

    return r
  })
}
getWxId()


// ------------------------------------------
// Authorization

let __access_token = wx.getStorageSync('access_token')
let __refresh_token = wx.getStorageSync('refresh_token')
// 这个过期时间不一定完全精确，只是在每次进入小程序时检查一下，之后随时可能被刷新或重新登录，
// 此外我们并不记录refresh_token的过期时间，毕竟重新登录的过程用户是无感知的。
let __access_token_expires = wx.getStorageSync('access_token_expires')
if (!__access_token_expires || __access_token_expires < new Date().getTime()) {
  __access_token = __refresh_token = null
}

let __Authorization = null
let __AuthPromise = null

function get_auth({ auth } = {}) {
  if (auth === 'no') {
    return Promise.resolve({ Authorization: null })
  }

  if (!__AuthPromise) {
    __AuthPromise = getToken()
  }

  return __AuthPromise.catch(e => {
    console.warn('auth fail:', e)

    if (auth === 'yes') {
      // 跟网页版不一样，这个login直接可以返回access_token
      return __AuthPromise = login()
    } else {
      return null
    }
  }).then(access_token => {
    // NOTE:
    // authenticated=true表示用户有航班管家身份，否则没有，初始值为false。
    // authenticated的值直接决定了页面上的关键按钮是否指向了getuserinfo。
    //
    // 从false到true的操作有:
    // - 成功登录
    // - 登录失败但注册成功，此处在注册成功之前会一直是false
    //
    // 从true到false的操作有:
    // - 此微信号与手机或其他绑定在一起，此时可以直接登录成功，但之后将此微信解绑
    //   再打开小程序时，因为缓存里有token会认为已有管家账号，直到此token过期需
    //   要重新登录时才会发现此微信登录不了，需要重新走一遍注册账号的流程
    // - 注销管家账号
    if (access_token) {
      __Authorization = 'Basic ' + base64.encode(access_token)
      signals.broadcast('authenticated', true)
    } else {
      __Authorization = null
      signals.broadcast('authenticated', false)
    }
    return { Authorization: __Authorization }
  })
}

function refresh_auth({ invalidAuth } = {}) {
  // 报告的无效token与当前token一致才会刷新token
  if (__Authorization && __Authorization === invalidAuth) {
    __Authorization = 'Refresh@' + new Date().getTime()

    console.info('#refreshToken')
    __AuthPromise = refreshToken()
  }
}

function register(params) {
  let p = __AuthPromise || Promise.reject(null)

  // 前面的(如果有)登陆必须出错了才会进行注册
  return p.catch(() => {
    return __AuthPromise = Promise.resolve(params).then(params => {
      return request_ticket({
        auth: 'no',
        url: '/gateway/user/minlogin',
        method: 'POST',
        sidFields: ['uid','pid','code','systemtime'],
        data: {
          pid: 41075,
          code: params.code,
          signature: params.signature,
          iv: params.iv,
          rawdata: params.rawData,
          encrypteddata: params.encryptedData
        }
      }, false)
    }).then(r => {
      return __handle_auth_response(r)
    }).catch(e => {
      console.error('#request register fail:', e)
      throw e
    })
  })
}

function login() {
  return wx.loginAsync().then(({ code }) => {
    return request_ticket({
      auth: 'no',
      url: '/gateway/user/minloginonly',
      method: 'POST',
      sidFields: ['uid','pid','code','systemtime'],
      data: {
        pid: 41076,
        code
      }
    }, false)
  }).then(r => {
    return __handle_auth_response(r)
  })
}

function getToken() {
  if (!__access_token) {
    return Promise.reject(new Error('no access token'))
  } else {
    return Promise.resolve(__access_token)
  }
}

function refreshToken() {
  if (!__refresh_token) {
    return Promise.reject(new Error('no refresh token'))
  }

  return request_ticket({
    auth: 'no',
    url: '/gateway/user/authtemp',
    method: 'POST',
    sidFields: ['uid','pid','refreshcode','systemtime'],
    data: {
      pid: 41012,
      refreshcode: __refresh_token
    }
  }, false).then(r => {
    return __handle_auth_response(r)
  })
}

function __handle_auth_response(r) {
  let authcode = get(r, 'data.res.bd.authcode')

  if (authcode) {
    let authExpire = get(r, 'data.res.bd.authExpiretime')

    __access_token = authcode
    wx.setStorageSync('access_token', __access_token)
    wx.setStorageSync('access_token_expires', _.toDate(authExpire).getTime())

    // 刷新token的返回值里没有下列字段
    let refreshcode = get(r, 'data.res.bd.refreshcode')
    let userInfo = get(r, 'data.res.bd.userinfo')

    if (refreshcode) {
      __refresh_token = refreshcode
      wx.setStorageSync('refresh_token', __refresh_token)
    }
    if (userInfo) {
      wx.setStorageSync('user', userInfo)
    }

    return __access_token
  } else {
    __access_token = __refresh_token = null
    wx.removeStorageSync('access_token')
    wx.removeStorageSync('access_token_expires')
    wx.removeStorageSync('refresh_token')

    throw r.data
  }
}

function getCodeAndInfo() {
  return wx.loginAsync().then(({ code }) => {
    return wx.getUserInfoAsync().then(res => {
      res.code = code
      return res
    })
  })
}

// Authorization
// ------------------------------------------


// Utilities
function extractResponse(response) {
  let res = response.data && response.data.res
  let hd = res && res.hd
  let code = hd && hd.code

  if (code == 1) {
    return res
  } else {
    throw response
  }
}

function extractErrorMsg(response) {
  return get(response, 'data.res.hd.desc')
}

module.exports = {
  request: request_ticket,
  ticket: request_ticket,
  pay: request_pay,
  h5: request_h5,

  upload: upload('ticket'),

  get_auth,
  register,

  extractResponse,
  extractErrorMsg
}
