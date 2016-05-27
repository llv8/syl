from __builtin__ import eval
import re
import thread
import time

import redis
from Queue import Queue


pool = redis.ConnectionPool(host='192.168.0.108', port=6379, max_connections=10)
def get_redis():
    return redis.Redis(connection_pool=pool)

CMD_CNF = set([
    'CHAT' , 'CHECK_OL', 'DISPATCH_OL', 'RECV_LL'
]);


user_request = {}
request_user = {}
die_users = []
add_users = Queue(1000)

def web_socket_do_extra_handshake(request):
    if(re.match(r'^/syl\?i=[0-9]+&t=[a-z0-9]+$', request.uri)):
        param = request.uri.split('?')[1]
        params = param.split('&') 
        uid = params[0].split('=')[1]
        token = params[1].split('=')[1]
        if(token == get_redis().hget(uid + '_user', 't')):
            __add_user(uid, request)
            return
    request.ws_stream.close_connection(0, 'illegal connect')

def __add_uid_req(uid, request):
    ts = time.time()
    user_request[uid] = {'req':request, 'ts':ts}
    request_user[request] = {'uid':uid, 'ts':ts}
    
def web_socket_passive_closing_handshake(request):
    print(request_user[request] + ' closed')
    if(request_user.has_key(request)):
        uid = request_user[request]
        die_users.push({'uid':uid, 'ts':time.time()})
    
def __add_user(uid, request):
    add_users.put({'uid':uid, 'req':request, 'ts':time.time()})
    
def __remove_user(uid):
    if(user_request.has_key(uid)):
        request = user_request[uid]
        del user_request[uid]
        if(request_user.has_key(request)):
            del request_user[request]
   
def __get_ol(uid):
    cmd = 'CHECK_OL'
    friendids = get_redis().get(uid + '_friendids')
    ids = friendids.split(',')
    ols = []
    for id in ids:
        if(user_request.has_key(id)):
            ols.append(uid)  
    if(ols):
        __send_msg(uid, cmd + ' ' + ' '.join(ols))
                   
def __remove_notice(uid):
    cmd = 'RECV_LL'
    friendids = get_redis().get(uid + '_friendids')
    ids = friendids.split(',')
    for id in ids:
        __send_msg(id, cmd + ' ' + uid)

def __add_notice(uid):
    cmd = 'DISPATCH_OL'
    friendids = get_redis().get(uid + '_friendids')
    ids = friendids.split(',')
    for id in ids:
        __send_msg(id, cmd + ' ' + uid)

def __send_msg(uid, msg):
    if(user_request.has_key(uid)):
        try:
            user_request[uid].ws_stream.send_message(msg, binary=False)
            return True
        except Exception as e:
            die_users.push({'uid':uid, 'ts':time.time()})


def web_socket_transfer_data(request):
    try:
        while True:
            line = request.ws_stream.receive_message()
            if line is None:
                return
            if isinstance(line, unicode):
                ws_dispatch(line, request)
            else:
                # request.ws_stream.send_message(line, binary=True)
                pass
    except Exception as e:
        print(e)
    

def clear_thread():
    while True:
        user_dict = die_users.pop()
        if(user_dict):
            uid = user_dict['uid']
            ts = float(user_dict['ts'])
            ud = user_request[uid]
            if(float(ud['ts'] <= ts)):
                __remove_notice(uid)
                __remove_user(uid)
        else:
            time.sleep(30)
            
def add_thread():
     while True:
        user_dict = add_users.get_nowait()
        if(user_dict):
            uid = user_dict['uid']
            request = user_dict['req']
            ts = user_dict['ts']
            if(user_request.has_key(uid) and float(user_request[uid]['ts']) > float(ts)):
                pass
            else:
                __add_uid_req(uid, request)
                __add_notice(uid)
                __get_ol(uid)            
        else:
            time.sleep(30)
        
thread.start_new_thread (clear_thread)
thread.start_new_thread (add_thread)


def ws_dispatch(line, request):
    params = re.split('\s+', line.strip())
    if(params):
        if(params[0] in CMD_CNF):
            eval(params[0].lower())(request, params[1:], params[0])
        

        
def chat(request, params, cmd):
    frm = params[0]
    to = params[1]
    content = params[2]
    __send_msg(to, cmd + ' ' + frm + ' ' + content)
        
    
        
