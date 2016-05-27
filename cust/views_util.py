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
    
def get_s_uid(request):
    return request.session.get('uid')

def set_s_uid(request, uid):
    request.session['uid'] = uid

def get_vcode():
    return random.randint(1000, 9999) 

def resp(msg=None, level=2, extend={}):
    result = {'m':msg, 'l':level}
    result.update(extend)
    return  HttpResponse(json.dumps(result))

def get_param(request, key):
    param = request.POST.get(key)
    if(param):
        return param.strip(' ')
    else:
        return ''
    
def copy_user_dict(user):
    return {'i':user.id, 'n':user.name, 'is':user.ids, 't':user.pwd, 's':user.status}


def populate_user_dicts(groupuser, user_dicts):
    if(not groupuser.user.id in user_dicts):
        user_dicts[groupuser.user.id] = {'i':groupuser.user.id, 'is':groupuser.user.ids, 'n':groupuser.user.name, 'ol':0}  # ol:online
    user_dict = user_dicts[groupuser.user.id]
    if(not 'gus' in user_dict):  # gus:groupusers
        user_dict['gus'] = {}
    user_dict['gus'][groupuser.group.id] = {'gui':groupuser.id, 'm':groupuser.group.manager.id, 's':groupuser.status}
        
            

def copy_group_dict(group):
    return {'i':group.id, 'n':group.name}
