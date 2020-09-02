//index.js
//获取应用实例
const app = getApp()
const categoryUrl = 'https://minerw.cafminiapp.ac.cn/info/category'

Page({
  data: {
    showPicture: []
  },

  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: categoryUrl,
      success: (result) => {
        var categoArray = result['data']['category']
        console.log(categoArray)
        let showPicture = []
        for (var i = 0; i < categoArray.length; i++) {
          showPicture.push({
            id: categoArray[i]['id'],
            name: categoArray[i]['name'],
            imageurl: categoArray[i]['image']
          })
        }
        that.setData({
          showPicture: showPicture
        })
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  },

  onPullDownRefresh() {
    this.onLoad()
    wx.stopPullDownRefresh()
  },

  onTapShowItem: function (event) {
    console.log(event.currentTarget.dataset.id)
    var categoryid = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/trainList/trainList?id=' + categoryid,
    })
  }
})