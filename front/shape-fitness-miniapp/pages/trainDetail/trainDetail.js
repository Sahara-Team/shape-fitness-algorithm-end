// pages/trainDetail/trainDetail.js
const tf = require('@tensorflow/tfjs-core')
const posenet = require('@tensorflow-models/posenet')
const regeneratorRuntime = require("regenerator-runtime")

const app = getApp()

const itemUrl = 'https://minerw.cafminiapp.ac.cn/info/item_itemid'
const staticUrl = 'https://minerw.cafminiapp.ac.cn/item/static'
const newRecordUrl = 'https://minerw.cafminiapp.ac.cn/info/record_new'
const posenetUrl = 'https://www.gstaticcnapps.cn/tfjs-models/savedmodel/posenet/mobilenet/float/075/model-stride16.json'

Page({
    data: {
        itemid: "",
        requestType: "mabu",
        isTraining: false,
        cameraPosition: "back",
        score: "0.0",
        resultMap: {
            '0': '正确',
            '1': '错误1',
            '2': '错误2'
        },
        resultArray: {
            '正确': 100,
            '错误1': 0,
            '错误2': 0
        },
        imageUrls: []
    },

    onLoad: function (options) {
        console.log(options.id)
        var that = this
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
                var tempResultMap = {}
                var tempResultArray = {}
                for (var i = 0; i < item['resultheaders'].length; i++) {
                    tempResultMap[i] = item['resultheaders'][i]
                    tempResultArray[item['resultheaders'][i]] = i === 0 ? 100 : 0
                }
                that.setData({
                    itemid: item['id'],
                    requestType: item['requesttype'],
                    imageUrls: images,
                    resultMap: tempResultMap,
                    resultArray: tempResultArray
                })
                wx.setNavigationBarTitle({
                    title: item['name'],
                })
                console.log('requestType: ', that.data.requestType)
                console.log('resultMap: ', that.data.resultMap)
            }
        })
    },

    async onReady() {
        const camera = wx.createCameraContext(this)
        this.canvas = wx.createCanvasContext('pose', this)
        wx.showLoading({
            title: '加载模型中',
            mask: true
        })
        this.loadPosenet()
        let count = 0
        this.listener = camera.onCameraFrame((frame) => {
            count++
            if (count === 5) {
                if (this.net) {
                    this.drawPose(frame)
                }
                count = 0
            }
        })
    },

    async loadPosenet() {
        var constraint = {
            architecture: 'MobileNetV1',
            outputStride: 16,
            inputResolution: 400,
            multiplier: 0.75,
            modelUrl: posenetUrl
        }
        this.net = await posenet.load(constraint)
        wx.hideLoading({
            success: (result) => {
                wx.showToast({
                    title: '模型加载完成！',
                    icon: 'success'
                })
            }
        })
        console.log("[loadPosenet] Model Loaded")
    },

    async drawPose(frame) {
        var that = this
        const pose = await that.detectPose(frame, that.net)
        if (pose == null || that.canvas == null) return
        that.judgePose(pose)
        this.setData({
            score: pose.score
        })
        if (pose.score >= 0.2) {
            for (i in pose.keypoints) {
                const point = pose.keypoints[i]
                if (point.score >= 0.5) {
                    const {
                        y,
                        x
                    } = point.position
                    that.drawCircle(that.canvas, x, y)
                }
            }
        }
        const adjacentKeyPoints = posenet.getAdjacentKeyPoints(pose.keypoints, 0.3)
        for (i in adjacentKeyPoints) {
            const points = adjacentKeyPoints[i]
            that.drawLine(that.canvas, points[0].position, points[1].position)
        }
        that.canvas.draw()
    },

    async detectPose(frame, net) {
        const imgData = {
            data: new Uint8Array(frame.data),
            width: frame.width,
            height: frame.height
        }
        const imgSlide = tf.tidy(() => {
            const imgTensor = tf.browser.fromPixels(imgData, 4)
            return imgTensor.slice([0, 0, 0], [-1, -1, 3])
        })
        const pose = await net.estimateSinglePose(imgSlide, {
            flipHorizontal: false
        })
        imgSlide.dispose()
        return pose
    },

    async judgePose(pose) {
        var that = this
        var data = []
        const keypoints = pose.keypoints
        console.log(keypoints)
        for (var i = 0; i < keypoints.length; i++) {
            var temp = []
            temp.push(keypoints[i]['position']['x'])
            temp.push(keypoints[i]['position']['y'])
            temp.push(keypoints[i]['score'])
            data.push(temp)
        }
        wx.request({
            url: staticUrl,
            data: {
                type: that.data.requestType,
                data: data
            },
            method: "POST",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                var result = res.data['result']
                var tempData = {}
                for (var i = 0; i < result.length; i++) {
                    tempData[that.data.resultMap[i]] = parseInt(result[i] * 100)
                }
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
        console.log("[switchCamera] cameraPosition:", this.data.cameraPosition)
    },

    startTrain: function (event) {
        this.setData({
            isTraining: true
        })
        this.listener.start()
        console.log('[startTrain] isTraining', this.data.isTraining)
    },

    pauseTrain: function (event) {
        console.log('[pauseTrain] isTraining', this.data.isTraining)
    },

    stopTrain: function (event) {
        this.canvas.clearRect()
        this.setData({
            isTraining: false
        })
        this.listener.stop()
        this.add_new_train_record()
        console.log('[stopTrain] isTraining', this.data.isTraining)
    },

    add_new_train_record() {
        var userid = app.globalData.userid
        var itemid = this.data.itemid
        wx.request({
            url: newRecordUrl,
            data: {
                userid: userid,
                itemid: itemid
            },
            method: "POST",
            header: {
                'content-type': 'application/json'
            },
            success: (result) => {
                console.log(result)
            }
        })
    }
})