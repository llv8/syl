# -*- coding: utf-8 -*-
import top.api

url = 'http://gw.api.taobao.com/router/rest'
port = 80
appkey = '23363471'
secret = '64980120287d1f02564c2715e4faea0e'
req = top.api.AlibabaAliqinFcSmsNumSendRequest(url, port)
req.set_app_info(top.appinfo(appkey, secret))
 
req.extend = "123456"
req.sms_type = "normal"
req.sms_free_sign_name = "阿里大鱼"
req.sms_param = "{\"code\":\"1234\",\"username\":\"lewis\"}"
req.rec_num = "18161907873"
req.sms_template_code = "SMS_8986408"
try:
    resp = req.getResponse()
    print(resp)
except Exception, e:
    print(e)
