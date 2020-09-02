// pages/mytrain/mytrain.js
const app = getApp()
const getRecordUrl = 'https://minerw.cafminiapp.ac.cn/info/record_userid'

Page({
    data: {
        records: []
    },
    onLoad: function (options) {
        var that = this
        wx.request({
            url: getRecordUrl,
            data: {
                userid: app.globalData.userid
            },
            method: "POST",
            header: {
                'content-type': 'application/json'
            },
            success: (result) => {
                var recordArray = result['data']['record']
                console.log('records: ', recordArray)
                var records = []
                for (var i = 0; i < recordArray.length; i++) {
                    records.push({
                        number: i + 1,
                        name: recordArray[i]['itemname'],
                        date: recordArray[i]['date']
                    })
                }
                that.setData({
                    records: records
                })
            },
            fail: (res) => {
                console.log(res)
            }
        })
    },

    onPullDownRefresh: function () {
        this.onLoad()
        wx.stopPullDownRefresh();
    }
})