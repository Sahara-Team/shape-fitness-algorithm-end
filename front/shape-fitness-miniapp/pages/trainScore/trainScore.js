// pages/trainScore/trainScore.js
const tf = require('@tensorflow/tfjs-core')
const posenet = require('@tensorflow-models/posenet')
const regeneratorRuntime = require("regenerator-runtime")

const app = getApp()

const itemUrl = 'https://minerw.cafminiapp.ac.cn/info/item_itemid'
const scoreUrl = 'https://minerw.cafminiapp.ac.cn/item/score'
const posenetUrl = 'https://www.gstaticcnapps.cn/tfjs-models/savedmodel/posenet/mobilenet/float/075/model-stride16.json'
const newRecordUrl = 'https://minerw.cafminiapp.ac.cn/info/record_new'

Page({
    data: {
        itemid: "",
        isTraining: false,
        cameraPosition: "back",
        videoPath: "",
        modelPath: "",
        score: 0,
        mean_score: -1
    },

    onLoad: function (options) {
        console.log(options.id)
        var that = this
        that.setData({
            itemid: options.id
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
                wx.setNavigationBarTitle({
                    title: item['name'],
                })
            }
        })
        wx.downloadFile({
            url: 'https://minerw.cafminiapp.ac.cn/file/video/test.mp4',
            success(res) {
                if (res.statusCode === 200) {
                    console.log('downloaded')
                    that.setData({
                        videoPath: res.tempFilePath
                    })
                }
            }
        })
        // wx.downloadFile({
        //     url: modelJsonUrl,
        //     success: (result) => {
        //         if (result.statusCode === 200) {
        //             console.log('model downloaded')
        //             that.setData({
        //                 modelPath: result.tempFilePath
        //             })
        //         }
        //     }
        // })
    },

    async onReady() {
        wx.showLoading({
            title: '加载模型中',
            mask: true
        })
        const camera = wx.createCameraContext(this)
        this.canvas = wx.createCanvasContext('pose')
        this.loadPosenet()
        this.videoContext = wx.createVideoContext('demo-video')
        this.count = 0
        var that = this
        this.listener = camera.onCameraFrame((frame) => {
            that.count++
            if (that.count % 15 === 0) {
                if (this.net) {
                    this.drawPose(frame)
                }
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
            url: scoreUrl,
            data: {
                type: "jianshencao01",
                data: data,
                timeline: that.count,
                mean_score: that.data.mean_score
            },
            method: "POST",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                that.setData({
                    score: parseInt(res.data['result'] * 100),
                    mean_score: res.data['mean_result']
                })
                console.log(that.data.score)
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
        this.count = 0
        this.setData({
            isTraining: true
        })
        this.listener.start()
        this.videoContext.seek(0)
        this.videoContext.play()
        console.log('[startTrain] isTraining', this.data.isTraining)
    },

    stopTrain: function (event) {
        this.canvas.clearRect()
        wx.showToast({
            title: '最终得分:' + parseInt(this.data.mean_score * 100),
            icon: 'success',
            duration: 3000,
        })
        this.setData({
            isTraining: false,
            mean_score: -1
        })
        this.listener.stop()
        this.videoContext.stop()
        this.add_new_train_record()
        console.log('[stopTrain] isTraining:', this.data.isTraining, 'mean_score: ', this.data.mean_score)
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
                console.log('new_record_submit: ', result)
            }
        })
    }
})