# -*- encoding=utf8 -*-
__author__ = "Administrator"

from airtest.core.api import *
from poco.drivers.android.uiautomation import AndroidUiautomationPoco
poco = AndroidUiautomationPoco(use_airtest_input=True, screenshot_each_action=True)
auto_setup(__file__)

poco("android.widget.FrameLayout").child("android.widget.FrameLayout").offspring("android:id/content").offspring("android.view.View").swipe([-0.0282, -0.1961])
poco("com.tencent.mm:id/a8s").click()
