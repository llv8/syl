from django.shortcuts import render

# Create your views here.
def index(request):
    apps = ['chat.html', 'qa.html', 'tech.html', 'tools.html']
    return render(request, 'index.html', {'apps':apps})

def search(request):
    return None

def command(request):
    return None
