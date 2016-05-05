from datetime import datetime
import re

from django.http.response import HttpResponse
from django.shortcuts import render

import simplejson as json

from . import models


# Create your views here.
def index(request):
    pass
def register(request):
    cmd = request.POST['cmd']
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
    elif (re.match(r'^[A-Z0-9a-z_%+-]+@[A-Za-z0-9-]+.[A-Za-z]{2,4}$', cmd[3]) != None):
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
        
    return HttpResponse(json.dumps({'msg':'add user success', 'user':{'name':user.name, 'ids':user.ids, 'status':user.status
                                                                     }}))

def add_group(request):
    cmd = request.POST['cmd']
    cmds = cmd.split(' ')
    err_msg = None
    
    if (len(cmds) != 2) :
            err_msg = 'parameter more or less!'
    elif(len(cmds[1]) >= 50):
        err_msg = 'group name is too long!'

    if(err_msg):
        return HttpResponse(json.dumps({'msg':err_msg, 'level':2}))
    
    if(len(models.Group.objects.filter(name=cmds[1])) > 0):
        return  HttpResponse(json.dumps({'msg':'group name has been used', 'level':2}))
    
    group = models.Group(name=cmds[1])
    group.save()
    

def valid_user(request):
    pass

def apply_group(request):
    cmd = request.POST['cmd']
    cmds = cmd.split(' ')
    group = models.Group(name=cmds[1], status=0)
    group.save()
    html = "add user success"
    return HttpResponse(html)

def valid_group_user(request):
    cmd = request.POST['cmd']
    cmds = cmd.split(' ')
    user = models.Group(name=cmds[1], status=0)
    user.save()
    html = "add user success"
    return HttpResponse(html)

def login(request):
    cmd = request.POST['cmd']
    cmds = cmd.split(' ')
    err_msg = None
    
    if (len(cmds) != 2) :
            err_msg = 'parameter more or less!'
           
    if (len(cmds[1]) >= 50):
            err_msg = 'email or phone is too long!' 
    
    isEmail = False
    isPhone = False
            
    if (re.match(r'^1[3|5|7|8|][0-9]{9}$', cmds[1])):
            isPhone = True

    elif (re.match(r'^[A-Z0-9a-z_%+-]+@[A-Za-z0-9-]+.[A-Za-z]{2,4}$', cmd[1]) == None):
            isEmail = True

    if(isPhone):
        pass
    if(isEmail):
        pass

    if(err_msg):
        return HttpResponse(json.dumps({'msg':err_msg, 'level':2}))
    
def valid_login(request):
    request.GET['pwd']
    
    
def logout(request):
    del request.session['userid']

