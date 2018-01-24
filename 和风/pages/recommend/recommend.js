//logs.js
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    text: '你傻逼啊啊！'
  },
  onLoad: function() {
    var _this = this;
    console.log(this)
   wx.request({
      url: 'https://gank.io/api/data/Android/10/2',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: res=>{
        // success
        console.log(res)
        _this.setData({
          text: res.errMsg
        })
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  }
})
