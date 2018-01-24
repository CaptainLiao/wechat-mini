//index.js
//获取应用实例
let app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: () => {
    wx.navigateTo({
     url: '../logs/logs'
    })
  },
  onLoad:  () => {
   
  }
})
