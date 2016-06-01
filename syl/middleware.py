# -*- coding: utf-8 -*-

from cust.views_util import resp, get_s_uid
from django.http.response import HttpResponse


class LoginMiddleware:
    def process_request(self, request):
        try:
            request.META['HTTP_USER_AGENT'].index('Chrome')
        except Exception as e:
            return  HttpResponse('<h1>Please use Chrome browser</h1>')
        if(request.path == '/cust/register' or request.path == '/cust/login' or request.path == '/cust/vcode' or request.path == '/cust/userstatus' or request.path == '/'):
            pass
        else:
            uid = get_s_uid(request)
            if(not uid):
                return resp('请使用register或login命令注册或登录')
        return None
    
    
