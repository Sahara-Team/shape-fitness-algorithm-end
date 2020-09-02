# -*- encoding=utf8 -*-
__author__ = "Administrator"

from airtest.core.api import *
from poco.drivers.android.uiautomation import AndroidUiautomationPoco
poco = AndroidUiautomationPoco(use_airtest_input=True, screenshot_each_action=True)
auto_setup(__file__)

poco(text="传统项目").click()
poco(text="扎马步").click()
poco("android.widget.Button").click()
poco(text="切换摄像头").click()
poco(text="开始训练").click()
poco(text="暂停训练").click()
poco(text="结束训练").click()
poco("android.widget.FrameLayout").child("android.widget.FrameLayout").offspring("android:id/content").child("android.widget.FrameLayout").child("android.widget.FrameLayout").child("android.widget.FrameLayout").child("android.widget.FrameLayout").child("android.widget.FrameLayout")[0].offspring("com.te
' ncent.mm:id/dc").click()
poco("android.widget.FrameLayout").child("android.widget.FrameLayout").offspring("android:id/content").child("android.widget.FrameLayout").child("android.widget.FrameLayout").child("android.widget.FrameLayout").child("android.widget.FrameLayout").child("android.widget.FrameLayout")[0].offspring("com.tencent.mm:id/dc").click()
poco("com.tencent.mm:id/dc").click()
