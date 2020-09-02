const tf = require('@tensorflow/tfjs-core')
const posenet = require('@tensorflow-models/posenet')
const regeneratorRuntime = require('regenerator-runtime')
const requestUrl = 'https://minerw.cafminiapp.ac.cn/item'
const resultMap = {
  '0': '直臂正确',
  '1': '直臂膝盖贴地',
  '2': '直臂塌腰臀部太低',
  '3': '直臂臀部较高',
  '4': '直臂手臂没有伸直',
  '5': '直臂臀部过高',
  '6': '曲臂正确',
  '7': '曲臂膝盖贴地',
  '8': '曲臂臀部过高',
  '9': '曲臂塌腰臀部太低'
}

// index.js
Page({
  data: {
    screenWidth: wx.getSystemInfoSync().screenWidth,
    screenHeight: wx.getSystemInfoSync().screenHeight,
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight + 'px',
    navigationBarHeight: (wx.getSystemInfoSync().statusBarHeight + 44) + 'px',
    cameraPosition: "front",
    frameWidth: "",
    frameHeight: "",
    isModelLoaded: "",
    score: "",
    resultArray: ""
  },

  async onReady() {
    const camera = wx.createCameraContext(this) // 声明cameras
    this.canvas = wx.createCanvasContext('pose', this) // 声明canvas
    this.loadPosenet(0) // 载入posenet
    let count = 0
    this.listener = camera.onCameraFrame((frame) => {
      count++
      if (count === 5) {
        if (this.net) {
          this.drawPose(frame)
          this.setData({
            frameWidth: frame.width,
            frameHeight: frame.height
          })
        }
        count = 0;
      }
    })
  },

  async loadPosenet(type) {
    const POSENET_URL = [
      'https://www.gstaticcnapps.cn/tfjs-models/savedmodel/posenet/mobilenet/float/050/model-stride8.json',
      'https://www.gstaticcnapps.cn/tfjs-models/savedmodel/posenet/resnet50/float/model-stride16.json'
    ]
    var constraints = [{
        architecture: 'MobileNetV1',
        outputStride: 8,
        inputResolution: 257,
        multiplier: 0.5,
        modelUrl: POSENET_URL[0]
      },
      {
        architecture: 'ResNet50',
        outputStride: 16,
        inputResolution: 200,
        multiplier: 1,
        modelUrl: POSENET_URL[1]
      }
    ]
    this.net = await posenet.load(constraints[type])
    this.setData({
      isModelLoaded: "Loaded"
    })
  },

  async drawPose(frame) {
    var that = this
    const pose = await this.detectPose(frame, this.net)
    if (pose == null || this.canvas == null) return
    that.judgePose(pose)
    this.setData({
      score: pose.score
    })
    if (pose.score >= 0.3) {
      for (i in pose.keypoints) {
        const point = pose.keypoints[i]
        if (point.score >= 0.5) {
          const {
            y,
            x
          } = point.position
          this.drawCircle(this.canvas, x, y)
        }
      }
      const adjacentKeyPoints = posenet.getAdjacentKeyPoints(pose.keypoints, 0.3)
      for (i in adjacentKeyPoints) {
        const points = adjacentKeyPoints[i]
        this.drawLine(this.canvas, points[0].position, points[1].position)
      }
      this.canvas.draw()
    }
  },

  async detectPose(frame, net) {
    const imgData = {
      data: new Uint8Array(frame.data),
      width: frame.width,
      height: frame.height
    };
    const imgSlide = tf.tidy(() => {
      const imgTensor = tf.browser.fromPixels(imgData, 4);
      return imgTensor.slice([0, 0, 0], [-1, -1, 3]);
    });
    const pose = await net.estimateSinglePose(imgSlide, {
      flipHorizontal: false
    });
    imgSlide.dispose();
    return pose;
  },

  async judgePose(pose) {
    var that = this
    var data = []
    for (var i = 0; i < pose.keypoints.length; i++) {
      var temp = []
      temp.push(pose.keypoints[i]['position']['x'])
      temp.push(pose.keypoints[i]['position']['y'])
      temp.push(pose.keypoints[i]['score'])
      data.push(temp)
    }
    wx.request({
      url: requestUrl,
      data: {
        name: "plank",
        data: data
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var result = res.data['result']
        var tempData = {}
        for (var i = 0; i < result.length; i++) {
          tempData[resultMap[i]] = result[i]
        }
        console.log(tempData)
        that.setData({
          resultArray: tempData
        })
      },
      fail: function (res) {
        that.setData({
          resultArray: 'failure' + res
        })
      }
    })
  },

  drawCircle(canvas, x, y) {
    canvas.beginPath()
    canvas.arc(x, y, 5, 0, 2 * Math.PI)
    canvas.fillStyle = 'aqua'
    canvas.fill()
  },

  drawLine(canvas, pos0, pos1) {
    canvas.beginPath()
    canvas.moveTo(pos0.x, pos0.y)
    canvas.lineTo(pos1.x, pos1.y)
    canvas.lineWidth = 5
    canvas.strokeStyle = `aqua`
    canvas.stroke()
  },

  switchCamera: function (event) {
    if (this.data.cameraPosition === 'front') {
      this.setData({
        cameraPosition: 'back'
      })
    } else {
      this.setData({
        cameraPosition: 'front'
      })
    }
  },

  startListener: function (event) {
    this.listener.start()
  },

  stopListener: function (event) {
    this.listener.stop()
  },

  resultMapping(resultType) {

  }
})