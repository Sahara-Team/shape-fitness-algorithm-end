# -*- encoding=utf8 -*-
__author__ = "Administrator"

from airtest.core.api import *

auto_setup(__file__)
poco("android.widget.FrameLayout").child("android.widget.FrameLayout").offspring("android:id/content").offspring("android.view.View").swipe([0.0035, -0.202])
poco("com.tencent.mm:id/a8s").click()

