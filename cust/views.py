# -*- coding: utf-8 -*-
from django.http.response import HttpResponse
import random
import re

from cust import send_mail
import simplejson as json

from . import models
from util import sylredis

def get_cmd_params(request):
    cmd = request.POST['cmd'].strip(' ')
    cmds = re.split('\s+', cmd)
    if(cmds):
        return cmds[1:]
    else:
        return []
    
def register(request):
    params = get_cmd_params(request)
    err_msg = None
    
    if (len(params) != 3) :
            return resp(PARAM_NUM)
    
    username = params[0]
    phone = params[1]
    mail = params[2]
    
    if(len(username) >= 50):
        err_msg = USERNAME_LEN_LONG
    elif(len(username.split(',')) != 2 or not (len(username.split(',')[0]) > 0 and len(username
                .split(',')[1]) > 0)) :
        err_msg = USERNAME_FMT
    elif (not re.match(RE_PHONE, phone)):
            err_msg = PHONE_INV
    elif (len(mail) >= 50 or re.match(RE_MAIL, mail) == None):
            err_msg = MAIL_INV
    if(err_msg):
        return resp(err_msg)
    
        
    if(len(models.User.objects.filter(phone=phone)) > 0):
        return  resp(PHONE_USED)
    if(len(models.User.objects.filter(email=mail)) > 0):
        return  resp(MAIL_USED)
    maxids = models.User.objects.filter(name=username).order_by('-ids')
    ids = 0
    if(len(maxids) > 0):
        ids = maxids[0].ids + 1
    user = models.User(name=username, phone=phone, email=mail, ids=ids)
    
    # send vcode
    vcode = get_vcode()
    
    if(not send_mail.send_vcode(user.email, user.name, vcode)):
        return resp(SYS_ERR)
    
    user.save()
    sylredis.set_vcode(vcode)  
    request.session['userid'] = user.id
    
    return resp(REG_SUCC, 1, {'user':{'id':user.id, 'name':user.name, 'ids':user.ids, 'status':user.status
                                                                     }})

def vcode(request):
    params = get_cmd_params(request)
    if()

def add_group(request):
    isLogin = True
    if not isLogin:
        return resp('please login')
    cmd = request.POST['cmd'].strip(' ')
    cmds = cmd.split(' ')
    err_msg = None
    
    if (len(cmds) != 2) :
            err_msg = 'parameter more or less!'
    elif(len(cmds) == 2 and len(cmds[1]) >= 50):
        err_msg = 'group name is too long!'

    if(err_msg):
        return resp(err_msg)
    
    if(len(models.Group.objects.filter(name=cmds[1])) > 0):
        return  resp('group name has been used')
    if(not request.session.get('userid')):
        return resp('first login')
    
    group = models.Group(name=cmds[1], manager=models.User(id=request.session['userid']))
    group.save()
    return resp('group add success', 1)
    

def valid_user(request):
    pass

def apply_group(request):
    cmd = request.POST['cmd'].strip(' ')
    cmds = cmd.split(' ')
    group = models.Group(name=cmds[1], status=0)
    group.save()
    return resp('add user success', 1)

def valid_group_user(request):
    cmd = request.POST['cmd'].strip(' ')
    cmds = cmd.split(' ')
    user = models.Group(name=cmds[1], status=0)
    user.save()
    return resp('add user success', 1)

def login(request):
    cmd = request.POST['cmd'].strip(' ')
    cmds = cmd.split(' ')
    err_msg = None
    
    if (len(cmds) != 2) :
            err_msg = 'parameter more or less!'
           
    if (len(cmds) == 2 and len(cmds[1]) >= 50):
            err_msg = 'email or phone is too long!' 
    
    if(err_msg):
        return resp(err_msg)
    
    isEmail = False
    isPhone = False
            
    if (re.match(r'^1[3|5|7|8|][0-9]{9}$', cmds[1])):
            isPhone = True

    elif (re.match(r'^[A-Z0-9a-z_%+-]+@[A-Za-z0-9-]+.[A-Za-z]{2,4}$', cmds[1])):
            isEmail = True

    if(isPhone):
        # TODO: send sms
        pass
    if(isEmail):
        # TODO: send email
        pass
    
    if(not isPhone and not isEmail):
        return resp('phone or email is invalid')
    users = None
    if(isPhone):
        users = models.User.objects.filter(phone=cmds[1])
    if(isEmail):
        users = models.User.objects.filter(email=cmds[2])
        
    if(users == None or len(users.values()) == 0):
        return resp('phone or email is not exists')
        
    if(len(users.values()) > 1):
        pass  # system error
    request.session['userid'] = users.values()[0]['id']
    if(isPhone):
        return resp('sms is sent,please valid', 1, {'user', users.values()[0]})
    if(isEmail):
        return resp('mail is sent,please valid', 1, {'user', users.values()[0]})
    
    
def valid_login(request):
    request.GET['pwd'].strip(' ')
    

    
def logout(request):
    del request.session['userid']
    return resp('logout', 1)

def applygroup(request):
    
    cmd = request.POST['cmd'].strip(' ')
    cmds = cmd.split(' ')
    err_msg = None
    
    if (len(cmds) != 2) :
            err_msg = 'parameter more or less!'
           
    if (len(cmds) == 2 and len(cmds[1]) >= 50):
            err_msg = 'group name is not exists'
    
    group = models.Group.objects.get(name=cmds[1])
    
    if(not group):
        err_msg = 'group name is not exists' 
    
    if(err_msg):
        return resp(err_msg)
    
    
    if(not request.session.get('userid')):
        return resp('first login')
    # user = models.GroupUser.objects.get(user=models.User(id=request.session.get('userid')))
    # if(not models.GroupUser.objects.get(user=models.User(id=request.session.get('userid')))):
    models.GroupUser(group=group, user=models.User(id=request.session.get('userid'))).save()
    return resp('waiting for group manager check', 1)

def get_user2group(userid):
    users = models.GroupUser.objects.filter(user=models.User(id=userid))
    
def get_vcode():
    return random.randint(1000, 9999) 

def resp(msg, level=2, extend={}):
    result = {'msg':msg, 'level':level}
    result.update(extend)
    return  HttpResponse(json.dumps(result))

PARAM_NUM = '参数个数不正确'
USERNAME_LEN_LONG = '用戶名太长'
USERNAME_LEN_SHORT = '用户名太短'
USERNAME_FMT = '用户名格式不正确'
PHONE_INV = '手机号不合法'
MAIL_INV = '邮箱不合法'
PHONE_USED = '手机号已被使用'
MAIL_USED = '邮箱已被使用'
SYS_ERR = '系统错误，请与管理员联系'
REG_SUCC = '注册成功，登录邮箱获取验证码'
RE_PHONE = r'^1[3|5|7|8|][0-9]{9}$'
RE_MAIL = r'^[A-Z0-9a-z_%+-]+@[A-Za-z0-9-]+.[A-Za-z]{2,4}$'
