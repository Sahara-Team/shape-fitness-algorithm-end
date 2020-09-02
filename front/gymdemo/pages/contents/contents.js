// pages/contents/contents.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      nodes: "<h1 style='color:red;'>html标题</h1>",
      nodes1: [{
        name: "h1",
        attrs: {
          style: "color:red",
          class: "red"
        },
        children: [{
          type: "text",
          text: '结点列表标题'
        }]
      }],


// 要点
      nodespoints: [{
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
            text: '屈肘，小臂与前脚掌撑地，耳、肩、髋、膝、踝呈一条直线。'
          }],
        }, {
          name: "li",
          attrs: {
            style: "color:black",
            class: "uuu"
          },
          children: [{
            type: "text",
            text: '手肘朝脚的方向用力，脚尖用力向前勾起，与地面摩擦力对抗，小臂按紧地面。'
          }],
        }]
      }],


 // 细节
    nodesmodel: [{
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
          text: '用力撑高身体。'
        }],
      }, {
        name: "li",
        attrs: {
          style: "color:black",
          class: "uuu"
        },
        children: [{
          type: "text",
          text: '收紧腹部，不能塌腰 、膝、踝呈一条直线。'
        }],
      }]
    }]

  },






tap() {
    console.log('tap')
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})