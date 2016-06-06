from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie


@ensure_csrf_cookie
def index(request):
    apps = ['chat.html','tech.html','qa.html','tools.html']
    return render(request, 'index.html', {'apps':apps})

def search(request):
    return None

def command(request):
    return None
