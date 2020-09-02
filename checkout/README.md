### Airtest环境配置

#### ADB安装：

​	添加到系统环境变量

![img](https://img-blog.csdnimg.cn/20190523103408655.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MzkyNzEzOA==,size_16,color_FFFFFF,t_70)

​	命令行输入adb version 查看版本 可以看出是否安装成功

![在这里插入图片描述](https://img-blog.csdnimg.cn/2019052310345845.png)



#### 安装Poco：

​	pip install pocoui



#### 连接Android手机

​	通过ADB连接你的电脑和Android手机，即可开始调试Android应用。AirtestIDE依赖ADB与安卓设备进行通信。

​	打开AirtestIDE，按照以下步骤进行连接：

1. 打开手机 `设置-开发者选项-**USB调试开关**，同时需要**打开 “USB安装”** 和 “**USB调试(安全设置)**”
2. 在AirtestIDE设备面板中点击 `Refresh ADB` 按钮，查看连接上的设备
3. 点击对应设备的 `Connect` 按钮，进行初始化



### Jmeter环境配置

1. 新增JMETER_HOME环境变量，变量值为JMeter解压的路径
2. 编辑CLASSPATH，加上%JMETER_HOME%
3. 完成以上操作后打开JMeter中bin目录下面的jmeter.bat文件即可打开JMeter了，打开的时候会有两个窗口，Jmeter的命令窗口和Jmeter的图形操作界面，不要关闭命令窗口



### Appium环境搭建

1. 安装Node.js

   ```python3
   C:\Users\Hulk>node -v
   v10.13.0
   ```

2. 安装JDK，及配置环境变量

3. 安装SDK，及配置环境变量

   点击AndroidSDK工具>>SDK Tools>>会跳转

   ```text
   C:\Users\Hulk>adb version
   Android Debug Bridge version 1.0.40
   Version 4986621
   Installed as C:\Program Files (x86)\Android\android-sdk\platform-tools\adb.exe
   ```

4. 安装Appium桌面版本

