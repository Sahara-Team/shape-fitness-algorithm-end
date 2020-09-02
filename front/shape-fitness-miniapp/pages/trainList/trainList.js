const tradiOptions = ['扎马步', '八段锦']
const tradiPictures = ['/images/0.png', '/images/1.png']
const danceOptions = ['减脂操', '健身操']
const dancePictures = ['/images/2.png', '/images/3.png']

const itemCategoUrl = 'https://minerw.cafminiapp.ac.cn/info/item_cateid'

Page({
    data: {
        categoryid: "",
        showPicture: []
    },

    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '训练列表',
        })
        console.log('categoryid:', options.id)
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        var that = this
        that.setData({
            categoryid: options.id
        })
        wx.request({
            url: itemCategoUrl,
            data: {
                'categoryid': that.data.categoryid
            },
            method: "POST",
            header: {
                'content-type': 'application/json'
            },
            success: (result) => {
                var itemArray = result['data']['item']
                console.log(itemArray)
                var showPicture = []
                for (var i = 0; i < itemArray.length; i++) {
                    showPicture.push({
                        id: itemArray[i]['id'],
                        name: itemArray[i]['name'],
                        imageurl: itemArray[i]['imageurl']
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

    onTapShowItem: function (event) {
        var itemid = event.currentTarget.dataset.id
        console.log(itemid)
        wx.navigateTo({
            url: '/pages/trainIntro/trainIntro?id=' + itemid
        })
    }
})