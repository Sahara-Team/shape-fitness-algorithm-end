# Shape健身平台

**运行示意图**：

![image](https://github.com/Sahara-Team/shape-fitness-algorithm-end/blob/master/images/demo.gif)

![image](https://github.com/Sahara-Team/shape-fitness-algorithm-end/blob/master/images/demo1.gif)

**小程序二维码**：

<img src="https://github.com/Sahara-Team/shape-fitness-algorithm-end/blob/master/images/qrcode.jpg">

**Web版项目地址**：http://118.178.188.222:1234

## 后端和算法服务部署

在服务器上，通过Dockerfile创建一个docker

`docker build -t shapefitness .`

运行docker

`docker run -it shapefitness /bin/bash  `

即可完成后端和算法服务在服务器端的部署。

## 致谢
1. [tensorflow/tfjs-models/posenet](https://github.com/tensorflow/tfjs-models/tree/master/posenet)
2. [tensorflow/tfjs-wechat](https://github.com/tensorflow/tfjs-wechat)
