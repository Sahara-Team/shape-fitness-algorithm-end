// pages/myhome/myhome.js
const app = getApp()
const userinfoUrl = 'https://minerw.cafminiapp.ac.cn/user/info_userid'
const updateUserInfoUrl = 'https://minerw.cafminiapp.ac.cn/user/info_set'

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        // 判断getUserInfo是否能够使用
        canIUse: wx.canIUse('button.open-type.getUserInfo'),

        sex_array: ['男', '女'],
        sex_index: 0,
        height_array: Array.from(new Array(250 + 1).keys()).slice(140),
        height_index: 20,
        weight_array: Array.from(new Array(250 + 1).keys()).slice(30),
        weight_index: 20,
        age_array: Array.from(new Array(80 + 1).keys()).slice(18),
        age_index: 12
    },

    onLoad: function () {
        var that = this
        console.log(app.globalData.userid)
        wx.request({
            url: userinfoUrl,
            data: {
                'userid': app.globalData.userid
            },
            method: "POST",
            header: {
                'content-type': 'application/json'
            },
            success: (result) => {
                var user_info = result['data']
                console.log(user_info)
                that.setData({
                    sex_index: user_info['gender'] - 1,
                    height_index: parseInt(user_info['height']) - 140,
                    weight_index: parseInt(user_info['weight']) - 30,
                    age_index: parseInt(user_info['age']) - 18
                })
            }
        })
        // 如果globalData中存有userInfo
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },

    getUserInfo: function (e) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },

    //事件处理函数
    bindViewTap: function () {
        console.log('avatar tapped')
    },

    sex_bindPickerChange: function (e) {
        console.log(e.detail.value)
        this.setData({
            sex_index: e.detail.value
        })
        this.update_user_info()
    },

    height_bindPickerChange: function (e) {
        console.log(e.detail.value)
        this.setData({
            height_index: e.detail.value
        })
        this.update_user_info()
    },

    weight_bindPickerChange: function (e) {
        console.log(e.detail.value)
        this.setData({
            weight_index: e.detail.value
        })
        this.update_user_info()
    },

    age_bindPickerChange: function (e) {
        console.log(e.detail.value)
        this.setData({
            age_index: e.detail.value
        })
        this.update_user_info()
    },

    update_user_info() {
        var that = this
        var gender = parseInt(this.data.sex_index) + 1
        var height = parseInt(this.data.height_index) + 140
        var weight = parseInt(this.data.weight_index) + 30
        var age = parseInt(this.data.age_index) + 18
        console.log(gender, height, weight, age)
        wx.request({
            url: updateUserInfoUrl,
            data: {
                'userid': app.globalData.userid,
                'age': age,
                'gender': gender,
                'height': height,
                'weight': weight
            },
            method: "POST",
            header: {
                'content-type': 'application/json'
            },
            success: (result) => {
                var user_info = result['data']
                console.log(user_info)
            }
        })
    }
})