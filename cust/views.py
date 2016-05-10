from datetime import datetime
import re

from django.http.response import HttpResponse
from django.shortcuts import render

import simplejson as json

from . import models

def register(request):
    cmd = request.POST['cmd'].strip(' ')
    cmds = cmd.split(' ')
    err_msg = None
    
    if (len(cmds) != 4) :
            err_msg = 'parameter more or less!'
    elif(len(cmds[1]) >= 50):
        err_msg = 'user name is too long!'
    elif(len(cmds[1].split(',')) != 2) :
        err_msg = 'user name is invalid!'
    elif (not (len(cmds[1].split(',')[0]) > 0 and len(cmds[1]
                .split(',')[1]) > 0)) :
        err_msg = 'user name is invalid!'
    elif (not re.match(r'^1[3|5|7|8|][0-9]{9}$', cmds[2])):
            err_msg = 'phone is invalid!'
    elif (len(cmds[3]) >= 50):
            err_msg = 'email is too long!'
    elif (re.match(r'^[A-Z0-9a-z_%+-]+@[A-Za-z0-9-]+.[A-Za-z]{2,4}$', cmds[3]) == None):
            err_msg = 'email is invalid!'
    if(err_msg):
        return HttpResponse(json.dumps({'msg':err_msg, 'level':2}))
    
        
    if(len(models.User.objects.filter(phone=cmds[2])) > 0):
        return  HttpResponse(json.dumps({'msg':'phone has been used', 'level':2}))
    if(len(models.User.objects.filter(email=cmds[3])) > 0):
        return  HttpResponse(json.dumps({'msg':'email has been used', 'level':2}))
    maxids = models.User.objects.filter(name=cmds[1]).order_by('-ids')
    ids = 0
    if(len(maxids) > 0):
        ids = maxids[0].ids + 1
    user = models.User(name=cmds[1], phone=cmds[2], email=cmds[3], ids=ids)
    user.save()
    # TODO: send email valid
    request.session['userid'] = user.id
    
    return HttpResponse(json.dumps({'msg':'add user success,go to mailbox to valid', 'user':{'id':user.id, 'name':user.name, 'ids':user.ids, 'status':user.status
                                                                     }}))

def add_group(request):
    isLogin = True
    if not isLogin:
        return HttpResponse(json.dumps({'msg':'please login', 'level':2}))
    cmd = request.POST['cmd'].strip(' ')
    cmds = cmd.split(' ')
    err_msg = None
    
    if (len(cmds) != 2) :
            err_msg = 'parameter more or less!'
    elif(len(cmds) == 2 and len(cmds[1]) >= 50):
        err_msg = 'group name is too long!'

    if(err_msg):
        return HttpResponse(json.dumps({'msg':err_msg, 'level':2}))
    
    if(len(models.Group.objects.filter(name=cmds[1])) > 0):
        return  HttpResponse(json.dumps({'msg':'group name has been used', 'level':2}))
    if(not request.session.get('userid')):
        return HttpResponse(json.dumps({'msg':'first login', 'level':2}))
    
    group = models.Group(name=cmds[1], manager=models.User(id=request.session['userid']))
    group.save()
    return HttpResponse(json.dumps({'msg':'group add success', 'level':1}))
    

def valid_user(request):
    pass

def apply_group(request):
    cmd = request.POST['cmd'].strip(' ')
    cmds = cmd.split(' ')
    group = models.Group(name=cmds[1], status=0)
    group.save()
    html = "add user success"
    return HttpResponse(html)

def valid_group_user(request):
    cmd = request.POST['cmd'].strip(' ')
    cmds = cmd.split(' ')
    user = models.Group(name=cmds[1], status=0)
    user.save()
    html = "add user success"
    return HttpResponse(html)

def login(request):
    cmd = request.POST['cmd'].strip(' ')
    cmds = cmd.split(' ')
    err_msg = None
    
    if (len(cmds) != 2) :
            err_msg = 'parameter more or less!'
           
    if (len(cmds) == 2 and len(cmds[1]) >= 50):
            err_msg = 'email or phone is too long!' 
    
    if(err_msg):
        return HttpResponse(json.dumps({'msg':err_msg, 'level':2}))
    
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
        return HttpResponse(json.dumps({'msg':'phone or email is invalid', 'level':2}))
    users = None
    if(isPhone):
        users = models.User.objects.filter(phone=cmds[1])
    if(isEmail):
        users = models.User.objects.filter(email=cmds[2])
        
    if(users == None or len(users.values()) == 0):
        return HttpResponse(json.dumps({'msg':'phone or email is not exists', 'level':2}))
        
    if(len(users.values()) > 1):
        pass  # system error
    request.session['userid'] = users.values()[0]['id']
    if(isPhone):
        return HttpResponse(json.dumps({'msg':'sms is sent,please valid', 'level':1, 'user':users.values()[0]}))
    if(isEmail):
        return HttpResponse(json.dumps({'msg':'email is sent,please valid', 'level':1, 'user':users.values()[0]}))
    
    
def valid_login(request):
    request.GET['pwd'].strip(' ')
    

    
def logout(request):
    del request.session['userid']
    return HttpResponse(json.dumps({'msg':'logout', 'level':1}))

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
        return HttpResponse(json.dumps({'msg':err_msg, 'level':2}))
    
    
    if(not request.session.get('userid')):
        return HttpResponse(json.dumps({'msg':'first login', 'level':2}))
    # user = models.GroupUser.objects.get(user=models.User(id=request.session.get('userid')))
    # if(not models.GroupUser.objects.get(user=models.User(id=request.session.get('userid')))):
    models.GroupUser(group=group, user=models.User(id=request.session.get('userid'))).save()
    return HttpResponse(json.dumps({'msg':'waiting for group manager check', 'level':1}))
