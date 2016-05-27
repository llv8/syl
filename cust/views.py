# -*- coding: utf-8 -*-
import hashlib
import logging
import re
import time

from cust import send_mail, send_sms
from cust.views_util import get_cmd_params, resp, get_vcode, \
 copy_user_dict, \
    copy_group_dict, populate_user_dicts, set_s_uid, get_s_uid
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
    
    __save_u(user)
    sylredis.set_vcode(user.id, vcode)  
    
    return resp(REG_SUCC, 1, {'u':copy_user_dict(user)})

def vcode(request):
    params = get_cmd_params(request)
    if(len(params) != 1):
        return resp(PARAM_NUM)
    id = request.POST.get('i')
    if(id):
        vcode = sylredis.get_vcode(id)
        if(vcode == params[0]):
            user = __get_u(id)
            user.pwd = hashlib.md5(str(id) + str(vcode)).hexdigest()
            user.status = 1
            user.utime = time.time()
            user_dict = copy_user_dict(user)
            user_dict['ts'] = time.time()
            set_s_uid(request, user.id)
            resp_obj = {'u':user_dict}
            resp_obj.update(__append_dict(id))
            __save_u(user)
            return resp(VCODE_SUCC, 1, resp_obj)
        else:
            return resp(VCODE_ERR)
    else:
        return resp(SYS_ERR)

def __append_dict(userid, timestamp=0):
    timestamp = float(timestamp) if timestamp else 0
    gus = models.GroupUser.objects.filter(user=models.User(id=userid), status=1)
    # 获当前用户的所有组的增量改变好友
    groupusers = models.GroupUser.objects.filter(group__in=[gu.group for gu in gus], utime__gte=timestamp, status__in=[-1, 1]).exclude(user__id=userid)
    # 获当前用户的所有组的所有活跃好友
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
    uid = get_s_uid(request)
    if(uid):
        user = __get_u(uid)
        user.pwd = None
        user.status = 0
        __save_u(user)
        del request.session['uid']
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
    user = __user_stat(request)
    if(user):
        if(user.status == 1):
            if(user.phone == params[0] or user.email == params[0]):
                resp(user.name + u'用户已登录', 1, {'u':copy_user_dict(user)})
            else:
                resp(user.name + u'用户已登录,请先logout', 1, {'u':copy_user_dict(user)})
                
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
    user.status = 0
    user.pwd = None
    __save_u(user)
    
    if(sylredis.get_vcode(user.id)):
        return resp('验证码已经发送至邮箱或手机，请查收', 1, {'u':copy_user_dict(user)})
    
    if(not valid_vcode_times(user.id)):
        return resp(VCODE_TIMES)
    
    if(isPhone):
        if(not send_sms.send_vcode(user.phone, user.name, vcode)):
            return resp(SYS_ERR)
    if(isEmail):
        if(not send_mail.send_vcode(user.email, user.name, vcode)):
            return resp(SYS_ERR)
    incr_vcode_times(user.id)
    sylredis.set_vcode(user.id, vcode)  
    msg = PHONE_SENT if isPhone else MAIL_SENT
    return resp(msg, 1, {'u':copy_user_dict(user)})

def valid_vcode_times(userid):
    key = str(userid) + '__' + time.strftime('%d')
    times = sylredis.get_str(key)
    if(times):
        if(int(times) >= 3):
            return False
    else:
        sylredis.set_str(key, 0, 24 * 60 * 60)
    return True
        
def incr_vcode_times(userid):
    key = str(userid) + '__' + time.strftime('%d')
    sylredis.get_redis().incrby(key, 1)
    
    
def signin(request):
    user = __user_stat(request)
    if(user):
        user_dict = copy_user_dict(user)
        resp_obj = {'u':user_dict} 
        if(user.pwd and user.status == 1):
            timestamp = request.POST.get('ts')
            resp_obj.update(__append_dict(user_dict['i'], timestamp))
            user_dict['ts'] = time.time()
            set_s_uid(request, user.id)
            __save_u(user)
        return resp(None, 1, resp_obj)
    else:
        return resp()

def __user_stat(request):
    id = request.POST.get('i')
    token = request.POST.get('t')
    status = request.POST.get('s')
    if(id):
        user = __get_u(id)
        if(user):
            if(token == user.pwd and int(status) == user.status and user.status == 1):
                if(not get_s_uid(request)):set_s_uid(request, user.id)
                return user
            elif(token == user.pwd and int(status) == user.status and user.status == 0):
                return user
            else:
                user.pwd = None
                user.status = 0
                __save_u(user)

def __save_u(user):
    user.save()
    sylredis.set_user(copy_user_dict(user))

def __get_u(uid):
    user = models.User.objects.get(id=uid)
    sylredis.set_user(copy_user_dict(user))
    return user

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
    
    group = models.Group(name=params[0], manager=models.User(id=get_s_uid(request)), utime=time.time())
    group.save()
    groupuser = models.GroupUser(group=group, user=models.User(id=get_s_uid(request)), status=1, utime=time.time())
    groupuser.save()
    return resp(ADDGROUP_SUCC, 1)


def apply_group(request):
    params = get_cmd_params(request)
    if(not models.Group.objects.get(id=params[0])):
            return resp(GROUP_NOT_EXISTS)
    group = models.Group(id=params[0])
    user = models.User(id=get_s_uid(request))
    if(models.GroupUser.objects.filter(group=group, user=user)):
        return resp(GROUP_USER_SUCC, 1)
    
    group_user = models.GroupUser(group=models.Group(id=params[0]), user=models.User(id=get_s_uid(request)), utime=time.time())
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
    uid = str(get_s_uid(request))
    token = request.POST['t']
    if(uid and token):
        if(sylredis.get_redis().hget(uid + '_user', 't') == token):
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
VCODE_TIMES = '发送验证码超过当天次数'

RE_USERNAME = r'^[a-zA-Z]+,[a-zA-Z]+$'
RE_PHONE = r'^1[3|5|7|8|][0-9]{9}$'
RE_MAIL = r'^[A-Z0-9a-z_%+-]+@[A-Za-z0-9-]+.[A-Za-z]{2,4}$'
