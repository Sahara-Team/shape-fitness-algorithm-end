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
    
    let option = ["弹力带上肢塑形","南美热舞","尊巴有氧操","中级hiit","闪电燃脂","潮流街舞减脂"]
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
      url: '/pages/contents/contents',
    })
  }
})