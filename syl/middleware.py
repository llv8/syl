# -*- coding: utf-8 -*-
from django.http.response import HttpResponse
import json

from cust import models
from cust.views_util import copy_user_dict, get_user_dict, resp, set_user_dict


class LoginMiddleware:
    def process_request(self, request):
        if(request.path == '/'):
            pass
        elif(request.path == '/cust/signin'):
            id = request.POST.get('id')
            token = request.POST.get('token')
            status = request.POST.get('status')
            if(not request.session.get('user')):
                user = models.User.objects.get(id=id)
                if(token == user.pwd and status == str(user.status)):
                    set_user_dict(request, user)
                else: 
                    return resp()
            return  resp(None, 1, {'user':get_user_dict(request)})
        elif(request.path == '/cust/register' or request.path == '/cust/login'):
            pass
        else:
            if(not get_user_dict(request)):
                return resp('请使用register或login命令注册或登录')
        return None
    
    
