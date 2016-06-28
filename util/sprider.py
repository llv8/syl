# -*- coding:utf-8 -*-  
'''
Created on Jun 12, 2016

@author: llv1
'''
import sys
import urllib2

from bs4 import BeautifulSoup
import simplejson
import time

url = "http://geek.csdn.net/hot"
request = urllib2.Request(url)
request.add_header("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:25.0) Gecko/20100101 Firefox/25.0")
request.add_header("Host", "geek.csdn.net")
request.add_header("Accept", "*/*")
request.add_header("Accept-Language", "zh-cn,zh;q=0.8,en-us;q=0.5,en;q=0.3")
# request.add_header("X-Requested-With", "XMLHttpRequest")
request.add_header("Referer", "http://geek.csdn.net")
request.add_header("Connection", "keep-alive")
resp = urllib2.urlopen(request)
html = ''  # resp.read()
  
'http://geek.csdn.net/service/news/get_news_list?jsonpcallback=jQuery2030079…5705141467&username=&from=6%3A80189&size=20&type=HackCount&_=1465705141471'
soup = BeautifulSoup(html) 
result = soup.find_all("dl", class_="geek_list")
for tag in result:
    a = tag.find_all("a", class_="title")[0]
    del a['class']
    count = tag.find_all("div", class_="count")[0].string
    read_num = tag.find_all("li", class_="read_num")[0].find_all("em")[0].string
    # if int(count) > 10 and read_num > 1000:
    print(a)


for_num = 50000;
fileopen = open("e:\\foo.txt", "r+")
# con = fileopen.read()
def ajax(from_='-'):
    global for_num
    global fileopen
    headers = {'Accept':'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01',
     'Accept-Language':'zh-CN,zh;q=0.8,en;q=0.6',
     'Connection':'keep-alive',
     'Cookie':'uuid_tt_dd=7114235876923035556662_20160612;dc_tos=o8nbmu; dc_session_id=1465713077385',
     'Host':'geek.csdn.net',
     'Referer':'http://geek.csdn.net/hot',
      'User-Agent':'User-Agent:Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36',
      'X-Requested-With':'XMLHttpRequest'
    }
    url = 'http://geek.csdn.net/service/news/get_news_list'
    request = urllib2.Request(url, data='from=' + from_ + '&size=20&type=HackCount', headers=headers)
    resp = urllib2.urlopen(request)
    json_obj = simplejson.loads(resp.read().decode('utf-8'), strict=False)
    soup = BeautifulSoup(json_obj['html'])
    result = soup.find_all("dl", class_="geek_list")

    for tag in result:
        a = tag.find_all("a", class_="title")[0]
        del a['class']
        count = tag.find_all("div", class_="count")[0].string
        read_num = tag.find_all("li", class_="read_num")[0].find_all("em")[0].string
        if int(count) > 0 and int(read_num) / int(count) < 200:
            url = a['href']
            text = a.string
            fileopen.write(simplejson.dumps({'url':url, 'text':text}) + '\r\n');
    if(json_obj['status'] == 1 and json_obj['has_more']):
        for_num = for_num - 1
        print(for_num)
        if(for_num > 0):
            time.sleep(0.5)
            ajax(json_obj['from'])
            
ajax()
fileopen.close()

