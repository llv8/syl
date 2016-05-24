# -*- coding: utf-8 -*-
import hashlib
import logging
import re
import time


from cust import send_mail, send_sms
from cust.views_util import get_cmd_params, resp, get_vcode, \
 copy_user_dict, set_user_dict, get_user_dict, \
    copy_group_dict, populate_user_dicts
from util import sylredis

from . import models

def register(request):
    logger = logging.getLogger(__name__)
    params = get_cmd_params(request)
    err_msg = None
    
    if (len(params) != 3) :
            return resp(PARAM_NUM)
    
    username = params[0]
    phone = params[1]
    mail = params[2]
    
    if(len(username) >= 50):
        err_msg = USERNAME_LEN_LONG
    elif(not re.match(RE_USERNAME, username)) :
        err_msg = USERNAME_FMT
    elif (not re.match(RE_PHONE, phone)):
            err_msg = PHONE_INV
    elif (len(mail) >= 50 or re.match(RE_MAIL, mail) == None):
            err_msg = MAIL_INV
    if(err_msg):
        return resp(err_msg)

    users = models.User.objects.filter(phone=phone, email=mail, name=username)
    if(len(users) > 0):
        # 如果数据库里有相同的手机号，邮箱和用户名，且redis里的该user的vcode存在，直接返回
        if(sylredis.get_vcode(users[0].id)):
            return resp(MAIL_SENT, 1, {'u':copy_user_dict(users[0])})
        else:
            # 如果数据库里有相同的手机号，邮箱和用户名，且redis里没有该user的vcode,重新发送
            vcode = get_vcode()
            if(not send_mail.send_vcode(mail, username, vcode)):
                return resp(SYS_ERR)
            else:
                return resp(MAIL_SENT, 1, {'u':copy_user_dict(users[0])})
        
    if(len(models.User.objects.filter(phone=phone)) > 0):
        return  resp(PHONE_USED)
    if(len(models.User.objects.filter(email=mail)) > 0):
        return  resp(MAIL_USED)
    
    # 如果有重名的username,用User里的ids来不区分
    maxids = models.User.objects.filter(name=username).order_by('-ids')
    ids = 0
    if(len(maxids) > 0):
        ids = maxids[0].ids + 1
    user = models.User(name=username, phone=phone, email=mail, ids=ids, utime=time.time())
    
    # send vcode
    vcode = get_vcode()
    
    if(not send_mail.send_vcode(user.email, user.name, vcode)):
        return resp(SYS_ERR)
    
    user.save()
    sylredis.set_vcode(user.id, vcode)  
    set_user_dict(request, user)
    
    return resp(REG_SUCC, 1, {'u':copy_user_dict(user)})

def vcode(request):
    params = get_cmd_params(request)
    if(len(params) != 1):
        return resp(PARAM_NUM)
    user_dict = get_user_dict(request)
    if(user_dict):
        userid = user_dict.get('i')
        vcode = sylredis.get_vcode(userid)
        if(vcode == params[0]):
            user = models.User.objects.get(id=userid)
            user.pwd = hashlib.md5(str(userid) + str(vcode)).hexdigest()
            user.status = 1
            user.utime = time.time()
            new_user_dict = copy_user_dict(user)
            set_user_dict(request, user)
            sylredis.set_user(new_user_dict)
            user.save()
            new_user_dict = copy_user_dict(user)
            new_user_dict['ts'] = time.time()  # ts:timestamp
            resp_obj = {'u':new_user_dict}
            resp_obj.update(__append_dict(userid, 0))
            return resp(VCODE_SUCC, 1, resp_obj)
        else:
            return resp(VCODE_ERR)

def __append_dict(userid, timestamp):
    timestamp = float(timestamp) if timestamp else 0
    gus = models.GroupUser.objects.filter(user=models.User(id=userid), status=1)
    groupusers = models.GroupUser.objects.filter(group__in=[gu.group for gu in gus], utime__gte=timestamp, status__in=[-1, 1]).exclude(user__id=userid)
    allgroupusers = models.GroupUser.objects.filter(group__in=[gu.group for gu in gus], status__in=[1]).exclude(user__id=userid)
    alluserids = set([str(gu.user.id) for gu in  allgroupusers])
    sylredis.set_str(str(userid) + '_friendids', ','.join(alluserids))
    user_dicts = {}
    for groupuser in groupusers:
        populate_user_dicts(groupuser, user_dicts)
    # TODO: groups = models.Group.objects.filter(status=1, utime__gte=timestamp)
    groups = models.Group.objects.filter(status=1, utime__gte=timestamp)
    group_dicts = {g.id:copy_group_dict(g) for g in groups}
    return {'gl':group_dicts, 'ul':user_dicts}
    
def logout(request):
    user_dict = get_user_dict(request)
    if(user_dict):
        user = models.User.objects.get(id=user_dict['i'])
        user.pwd = None
        user.status = 0
        user.save()
        del request.session['u']
    return resp(None, 1)

def login(request):
    
    params = get_cmd_params(request)
    if (len(params) != 1) :
        return resp(PARAM_NUM)
    
    isEmail = False
    isPhone = False
            
    if (re.match(RE_PHONE, params[0])):
            isPhone = True

    elif (re.match(RE_MAIL, params[0])):
            isEmail = True

    if(not isPhone and not isEmail):
        return resp(LOGIN_PARAM_INVALID)
    
    user_dict = get_user_dict(request)
    if(user_dict):
        persist_user = models.User.objects.get(id=user_dict['i'])
        if(persist_user.status == 1):
            return resp(persist_user.name + u'用户已登录,请先logout', 1, {'u':copy_user_dict(persist_user)})
        elif(persist_user.phone == params[0] or persist_user.email == params[0]):
            if(sylredis.get_vcode(persist_user.id)):
                return resp('验证码已经发送至邮箱或手机，请查收', 1, {'u':copy_user_dict(persist_user)})
        
    users = None
    if(isPhone):
        users = models.User.objects.filter(phone=params[0])
    if(isEmail):
        users = models.User.objects.filter(email=params[0])
    
    if(users == None or len(users) == 0):
        return resp(LOGIN_PARAM_NOEXISTS)
    
    # send vcode
    vcode = get_vcode()
    user = users[0]

    
    if(isPhone):
        if(not send_sms.send_vcode(user.phone, user.name, vcode)):
            return resp(SYS_ERR)
    if(isEmail):
        if(not send_mail.send_vcode(user.email, user.name, vcode)):
            return resp(SYS_ERR)
    sylredis.set_vcode(user.id, vcode)  
    set_user_dict(request, user)
    msg = PHONE_SENT if isPhone else MAIL_SENT
    return resp(msg, 1, {'u':copy_user_dict(user)})

    
def signin(request):
    user_stat = __user_stat(request)
    if(user_stat == 2):
        return resp(None, 1, {'u':get_user_dict(request)})
    if(user_stat == 3):
        id = request.POST.get('i')
        token = request.POST.get('t')
        status = request.POST.get('s')
        user = models.User.objects.get(id=id)
        if(id == user.id and token == user.pwd and status == str(user.status)):
            set_user_dict(request, user)
            sylredis.set_user(get_user_dict(request))
            user_stat = 1
    
    if(user_stat == 1):
        user_dict = get_user_dict(request)
        user_dict['ts'] = time.time()
        timestamp = request.POST.get('ts')
        resp_obj = {'u':user_dict} 
        resp_obj.update(__append_dict(user_dict['i'], timestamp))
        return resp(None, 1, resp_obj)
    
    return resp()

def __user_stat(request):
    # 1:valid,2:invalid,3:unlogin
    user_dict = get_user_dict(request)
    if(user_dict):
        if(user_dict['s'] == 1 and user_dict['t']):
            return 1
        else:
            return 2
    return 3

def add_group(request):
    params = get_cmd_params(request)
    err_msg = None
    
    if (len(params) != 1) :
            err_msg = PARAM_NUM
    elif(len(params[0]) >= 50):
        err_msg = GROUPNAME_LEN_LONG

    if(err_msg):
        return resp(err_msg)
    
    if(len(models.Group.objects.filter(name=params[0])) > 0):
        return  resp(GROUPNAME_USED)
    
    group = models.Group(name=params[0], manager=models.User(id=get_user_dict(request)['i']), utime=time.time())
    group.save()
    groupuser = models.GroupUser(group=group, user=models.User(id=get_user_dict(request)['i']), status=1, utime=time.time())
    groupuser.save()
    return resp(ADDGROUP_SUCC, 1)


def apply_group(request):
    params = get_cmd_params(request)
    if(not models.Group.objects.get(id=params[0])):
            return resp(GROUP_NOT_EXISTS)
    group = models.Group(id=params[0])
    user = models.User(id=get_user_dict(request)['i'])
    if(models.GroupUser.objects.filter(group=group, user=user)):
        return resp(GROUP_USER_SUCC, 1)
    
    group_user = models.GroupUser(group=models.Group(id=params[0]), user=models.User(id=get_user_dict(request)['i']), utime=time.time())
    group_user.save()
    return resp(GROUP_USER_SUCC, 1)

def approve_user(request):
    params = get_cmd_params(request)
    
    group = models.Group(id=params[0])
    user = models.User(id=params[1])
    groupuser = models.GroupUser.objects.get(group=group, user=user)
    if(not groupuser):
        return resp(GROUPUSER_NOT_EXISTS)
    
    groupuser.status = 1
    groupuser.save()
    return resp(APPROVE_SUCC, 1)

def regws(request):
    user_dict = get_user_dict(request)
    token = request.POST['t']
    if(user_dict and token):
        userid = str(user_dict['i'])
        if(sylredis.get_redis().hget(userid + '_user', 't') == token):
            return resp(None, 1)
    return resp(None, 2)
        
    
PARAM_NUM = '参数个数不正确'
USERNAME_LEN_LONG = '用戶名太长'
USERNAME_LEN_SHORT = '用户名太短'
GROUPNAME_LEN_LONG = '群组名太长'
USERNAME_FMT = '用户名格式不正确'
PHONE_INV = '手机号不合法'
MAIL_INV = '邮箱不合法'
PHONE_USED = '手机号已被使用'
MAIL_USED = '邮箱已被使用'
GROUPNAME_USED = '群组名已存在'
SYS_ERR = '系统错误，请与管理员联系'
REG_SUCC = '注册成功，登录邮箱获取验证码'
MAIL_SENT = '验证码已发送至邮箱'
PHONE_SENT = '验证码已发送至手机'
VCODE_ERR = '验证码错误'
VCODE_SUCC = '验证成功'
ADDGROUP_SUCC = '群组创建成功'
GROUP_USER_SUCC = '等待管理员审核..'
APPROVE_SUCC = '审核通过'
LOGIN_PARAM_INVALID = '手机或邮箱格式不正确'
LOGIN_PARAM_NOEXISTS = '手机或邮箱不存在'
GROUP_NOT_EXISTS = '该群组不存在'
GROUPUSER_NOT_EXISTS = '该群组成员不存在'

RE_USERNAME = r'^[a-zA-Z]+,[a-zA-Z]+$'
RE_PHONE = r'^1[3|5|7|8|][0-9]{9}$'
RE_MAIL = r'^[A-Z0-9a-z_%+-]+@[A-Za-z0-9-]+.[A-Za-z]{2,4}$'
