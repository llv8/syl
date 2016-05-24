# -*- coding: utf-8 -*-

from cust.views_util import  get_user_dict, resp


class LoginMiddleware:
    def process_request(self, request):
        if(request.path == '/cust/register' or request.path == '/cust/login' or request.path == '/cust/vcode' or request.path == '/cust/signin' or request.path == '/'):
            pass
        else:
            user_dict = get_user_dict(request)
            if(not user_dict or user_dict.get('s') != 1 or not user_dict.get('t')):
                return resp('请使用register或login命令注册或登录')
        return None
    
    
