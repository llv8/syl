from django.shortcuts import render
from . import models
from datetime import datetime
from django.http.response import HttpResponse
# Create your views here.
def index(request):
    pass
def add_user(request):
    cmd = request.POST['cmd']
    cmds = cmd.split(' ')
    user = models.User(name=cmds[1], gender=cmds[2], phone=cmds[3], email=cmds[4])
    user.save()
    html = "add user success"
    return HttpResponse(html)

def add_group(request):
    cmd = request.POST['cmd']
    cmds = cmd.split(' ')
    group = models.Group(name=cmds[1], status=1)
    group.save()
    html = "add user success"
    return HttpResponse(html)

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
    pass


