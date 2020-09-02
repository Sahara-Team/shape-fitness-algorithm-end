// pages/trainIntro/trainIntro.js
const nodespoints1 = [{
    name: "ul",
    attrs: {
        style: "padding:30px;border:1px black;",
        class: "uuu"
    },
    children: [{
        name: "li",
        attrs: {
            style: "color:black",
            class: "uuu"
        },
        children: [{
            type: "text",
            text: '两腿平行开立，两脚间距离三个脚掌的长度，然后下蹲，脚尖平行向前，勿外撇。两膝向外撑，膝盖不能超过脚尖，大腿与地面平行'
        }],
    }, {
        name: "li",
        attrs: {
            style: "color:black",
            class: "uuu"
        },
        children: [{
            type: "text",
            text: '同时胯向前内收，臀部勿突出。这样能使裆成圆弧形，俗称圆裆。含胸拔背，勿挺胸，胸要平，背要圆'
        }],
    }, {
        name: "li",
        attrs: {
            style: "color:black",
            class: "uuu"
        },
        children: [{
            type: "text",
            text: '两手可环抱胸前，如抱球状。虚灵顶劲，头往上顶，头顶如被一根线悬住'
        }],
    }]
}]
const nodesmodel1 = [{
    name: "ul",
    attrs: {
        style: "padding:30px;border:1px black;",
        class: "uuu"
    },
    children: [{
        name: "li",
        attrs: {
            style: "color:black",
            class: "uuu"
        },
        children: [{
            type: "text",
            text: "两脚不能与肩同宽，步幅过大或过小"
        }],
    }, {
        name: "li",
        attrs: {
            style: "color:black",
            class: "uuu"
        },
        children: [{
            type: "text",
            text: '下蹲幅度过小'
        }],
    }]
}]

const nodespoints2 = [{
    name: "ul",
    attrs: {
        style: "padding:30px;border:1px black;",
        class: "uuu"
    },
    children: [{
            name: "li",
            attrs: {
                style: "color:black",
                class: "uuu"
            },
            children: [{
                type: "text",
                text: '跳操别超过1小时'
            }],
        }, {
            name: "li",
            attrs: {
                style: "color:black",
                class: "uuu"
            },
            children: [{
                type: "text",
                text: '节奏太快容易运动量超负荷'
            }],
        },
        {
            name: "li",
            attrs: {
                style: "color:black",
                class: "uuu"
            },
            children: [{
                type: "text",
                text: '跳操时保持愉快心情'
            }],
        }
    ]
}]
const nodesmodel2 = [{
    name: "ul",
    attrs: {
        style: "padding:30px;border:1px black;",
        class: "uuu"
    },
    children: [{
        name: "li",
        attrs: {
            style: "color:black",
            class: "uuu"
        },
        children: [{
            type: "text",
            text: '塑造形体美 增进健康美'
        }],
    }, {
        name: "li",
        attrs: {
            style: "color:black",
            class: "uuu"
        },
        children: [{
            type: "text",
            text: '缓解精神压力，娱乐身心'
        }],
    }]
}]
const app = getApp()
const itemUrl = 'https://minerw.cafminiapp.ac.cn/info/item_itemid'

Page({
    data: {
        id: "item-c18268d0e76d11ea9aa500163e02e7a8",
        type: "static",
        imageUrls: ['/images/mabu.jpg'],
        title1: "扎马步",
        title2: "要点",
        title3: "错误示范",
        nodespoints: nodespoints1,
        nodesmodel: nodesmodel1,
        detailPageUrl: '/pages/trainDetail/trainDetail'
    },

    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '训练介绍',
        })
        var that = this
        console.log('itemid: ', options.id)
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        wx.request({
            url: itemUrl,
            data: {
                'itemid': options.id
            },
            method: "POST",
            header: {
                'content-type': 'application/json'
            },
            success: (result) => {
                var item = result['data']
                console.log('iteminfo: ', item)
                var images = []
                for (var i = 0; i < item['images'].length; i++) {
                    images.push(item['images'][i]['url'])
                }
                that.setData({
                    id: item['id'],
                    type: item['itemtype'],
                    imageUrls: images,
                    title1: item['name'],
                    title2: item['intro']
                })

                wx.hideLoading({
                    success: (res) => {},
                })
            }
        })
    },

    onTapEnterDetail: function (event) {
        var nextPageUrl = ""
        if (this.data.type === 'static') {
            nextPageUrl = '/pages/trainDetail/trainDetail?id=' + this.data.id
        } else if (this.data.type === 'dynamic') {
            nextPageUrl = '/pages/trainDynamic/trainDynamic?id=' + this.data.id
        } else if (this.data.type === 'score') {
            nextPageUrl = '/pages/trainScore/trainScore?id=' + this.data.id
        }
        console.log('navigateTo: ', nextPageUrl)
        wx.navigateTo({
            url: nextPageUrl,
        })
    }
})