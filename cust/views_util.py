# -*- coding: utf-8 -*-
from django.http.response import HttpResponse
import random
import re

import simplejson as json


def get_cmd_params(request):
    cmd = get_param(request, 'cmd')
    cmds = re.split('\s+', cmd)
    if(cmds):
        return cmds[1:]
    else:
        return []
    
def get_user_dict(request):
    return request.session.get('user')

def set_user_dict(request, user):
    request.session['user'] = copy_user_dict(user)

def get_vcode():
    return random.randint(1000, 9999) 

def resp(msg=None, level=2, extend={}):
    result = {'msg':msg, 'level':level}
    result.update(extend)
    return  HttpResponse(json.dumps(result))

def get_param(request, key):
    param = request.POST.get(key)
    if(param):
        return param.strip(' ')
    else:
        return ''
    
def copy_user_dict(user):
    return {'id':user.id, 'name':user.name, 'ids':user.ids, 'token':user.pwd, 'status':user.status}
