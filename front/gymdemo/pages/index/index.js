Page({
  data:{
    showPicture:[]
  },
  onLoad(){
    this.run()
  },
  run(){
    let showPicture = []
    let introduction = []
    let option = ["互动课程","热门课程","全身训练","热身课程","上身训练","下身训练"]
    for(let i=0;i<6;i+=1){
      showPicture.push({
        picturePath:'/images/' + i +'.png',
        introduction:option[i]
      })
    }
    this.setData({
      showPicture:showPicture
    })
  },

  onTapChangeView(){
    wx.navigateTo({
      url: '/pages/list/list',
    })
  }
})