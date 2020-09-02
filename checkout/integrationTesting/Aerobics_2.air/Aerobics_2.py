# -*- encoding=utf8 -*-
__author__ = "Administrator"

from airtest.core.api import *

auto_setup(__file__)

from poco.drivers.android.uiautomation import AndroidUiautomationPoco
poco = AndroidUiautomationPoco(use_airtest_input=True, screenshot_each_action=True)

poco(text="健身操").click()
poco(text="健身操").click()
poco("android.widget.Button").click()
poco(text="切换摄像头").click()
poco(text="开始训练").click()