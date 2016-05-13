# -*- coding: utf-8 -*-
import logging

import top.api


def send_vcode(to_phone, username, vcode):
    logger = logging.getLogger(__name__)
    url = 'gw.api.taobao.com'
    port = 80
    appkey = '23363471'
    secret = '64980120287d1f02564c2715e4faea0e'
    req = top.api.AlibabaAliqinFcSmsNumSendRequest(url, port)
    req.set_app_info(top.appinfo(appkey, secret))
     
    req.extend = "123456"
    req.sms_type = "normal"
    req.sms_free_sign_name = "四月儿"
    req.sms_param = "{'vcode':" + str(vcode) + ",'username':" + username + "}"
    req.rec_num = to_phone
    req.sms_template_code = "SMS_8896447"
    try:
        resp = req.getResponse()
        logger.info(resp)
        return True
    except Exception as e:
        logger.error(e)
        return False
