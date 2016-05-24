from __builtin__ import eval
import random
import re
import thread

import redis

pool = redis.ConnectionPool(host='192.168.0.108', port=6379, max_connections=10)
def get_redis():
    return redis.Redis(connection_pool=pool)

CMD_CNF = set([
    'CHAT' , 'CHECK_OL', 'DISPATCH_OL', 'RECV_LL'
]);


user_request = {}
request_user = {}

def web_socket_do_extra_handshake(request):
    if(re.match(r'^/syl\?i=[0-9]+&t=[a-z0-9]+$', request.uri)):
        param = request.uri.split('?')[1]
        params = param.split('&') 
        userid = params[0].split('=')[1]
        token = params[1].split('=')[1]
        if(token == get_redis().hget(userid + '_user', 't')):
            user_request[userid] = request
            request_user[request] = userid
            print(user_request.keys())
            return
    request.ws_stream.close_connection(0, 'illegal connect')
    
    
def web_socket_passive_closing_handshake(request):
    userid = request_user[request]
    cmd = 'RECV_LL'
    friendids = get_redis().get(userid + '_friendids')
    ids = friendids.split(',')
    for id in ids:
        if(user_request[id]):
            user_request[id].ws_stream.send_message(cmd + ' ' + userid, binary=False)
    del user_request[userid]
    del request_user[request]
    print('closed')
    
        
    

def web_socket_transfer_data(request):
    while True:
        line = request.ws_stream.receive_message()
        if line is None:
            return
        if isinstance(line, unicode):
            ws_dispatch(line, request)
        else:
            # request.ws_stream.send_message(line, binary=True)
            pass
        
def ws_dispatch(line, request):
    params = re.split('\s+', line.strip())
    if(params):
        if(params[0] in CMD_CNF):
            eval(params[0].lower())(request, params[1:], params[0])
        

        
def chat(request, params, cmd):
    frm = params[0]
    to = params[1]
    content = params[2]
    if(user_request.has_key(to)):
        user_request[to].ws_stream.send_message(cmd + ' ' + frm + ' ' + content, binary=False)
    request.ws_stream.send_message(cmd, binary=False)
        
def check_ol(request, params, cmd):
    ols = []
    for uid in params:
        if(user_request.has_key(uid)):
            ols.append(uid)
    
    request.ws_stream.send_message(cmd + ' ' + ' '.join(ols), binary=False)
        
def dispatch_ol(request, params, cmd):
    ol_userid = request_user[request]
    for id in params:
        if(user_request.has_key(id)):
            user_request[id].ws_stream.send_message(cmd + ' ' + ol_userid, binary=False)
    request.ws_stream.send_message(cmd, binary=False)
        
    
        
