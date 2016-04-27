from django.shortcuts import render
from . import models
from datetime import datetime
from django.http.response import HttpResponse
# Create your views here.
def index(request):
    pass
def add_user(request):
    cmd=request.POST['cmd']
    print(cmd)
    cmds = cmd.split(' ')
    user = models.User(name=cmds[1],gender=cmds[2],phone=cmds[3],email=cmds[4])
    user.save()
    html = "add user success"
    return HttpResponse(html)

def add_group(request):
    pass

def auth_cust_id(request):
    pass
def auth_cust_grp(request):
    pass