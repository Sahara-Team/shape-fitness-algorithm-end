var fetchWechat = require('fetch-wechat')
var tf = require('@tensorflow/tfjs-core')
var webgl = require('@tensorflow/tfjs-backend-webgl')
var plugin = requirePlugin('tfjsPlugin')

const loginUrl = 'https://minerw.cafminiapp.ac.cn/user/login'

//app.js
App({
  onLaunch: function () {
    plugin.configPlugin({
      fetchFunc: fetchWechat.fetchFunc(),
      tf,
      webgl,
      canvas: wx.createOffscreenCanvas()
    });

    // 登录
    wx.login({
      success: res => {
        console.log('user_code', res.code)
        wx.request({
          url: loginUrl,
          data: {
            code: res.code
          },
          header: {
            "Content-Type": "application/json"
          },
          method: 'POST',
          dataType: 'json',
          success: (result) => {
            console.log('user_uuid', result.data['userid'])
            wx.setStorage({
              data: result.data['userid'],
              key: 'userid'
            }) // 本地存储uuid
            this.globalData.userid = result.data['userid']
          },
          fail: (res) => {},
          complete: (res) => {},
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo

              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    userid: ""
  }
})