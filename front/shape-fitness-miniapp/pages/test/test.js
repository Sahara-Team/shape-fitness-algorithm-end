// pages/test.js
Page({
    data: {},

    onLoad: function (options) {
        var that = this
        wx.downloadFile({
            url: 'https://minerw.cafminiapp.ac.cn/video/test.mp4',
            success(res) {
                if (res.statusCode === 200) {
                    that.setData({
                        videoPath: res.tempFilePath
                    })
                }
            }
        })
    },

    onReady: function () {

    },

    gotoStatic: function (event) {
        wx.navigateTo({
            url: '/pages/trainDetail/trainDetail',
        })
    },

    gotoDynamic: function (event) {
        wx.navigateTo({
            url: '/pages/trainDynamic/trainDynamic',
        })
    }
})