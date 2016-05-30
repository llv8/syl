from __builtin__ import eval
import re
import thread
import time

import redis
from Queue import Queue
import simplejson
import urllib


pool = redis.ConnectionPool(host='192.168.0.108', port=6379, max_connections=10)
def get_redis():
    return redis.Redis(connection_pool=pool)

CMD_CNF = set([
    'CHAT' , 'CHECK_OL', 'DISPATCH_OL', 'RECV_LL', 'APPLY_GROUP', 'APPROVE_USER', 'REFRESH_OL'
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
    user_request[str(uid)] = {'req':request, 'ts':ts}
    request_user[request] = {'uid':uid, 'ts':ts}
    
def web_socket_passive_closing_handshake(request):
    uid = __get_uid(request)
    if(uid):
        print(uid + ' closed')
        die_users.append({'uid':uid, 'ts':time.time()})
        
    
def __add_user(uid, request):
    add_users.put({'uid':uid, 'req':request, 'ts':time.time()})
    
def __remove_user(uid):
    req = __get_req(uid)
    if(req):
        del request_user[req]
    if(user_request.has_key(uid)):
        del user_request[uid]
            
def __get_uid(req):
    if(request_user.has_key(req)):
        return request_user[req]['uid']
    
def __get_req(uid):
    if(user_request.has_key(str(uid))):
        return user_request[str(uid)]['req']
    
   
def __get_ol(uid):
    cmd = 'CHECK_OL'
    friendids = get_redis().get(uid + '_friendids')
    ids = friendids.split(',')
    ols = []
    for id in ids:
        if(__get_req(id)):
            ols.append(id)  
    if(ols):
        __send_msg(uid, {'cmd':cmd, 'uids':ols})
                   
def __remove_notice(uid):
    cmd = 'RECV_LL'
    friendids = get_redis().get(uid + '_friendids')
    ids = friendids.split(',')
    for id in ids:
        if(__get_req(id)):
            __send_msg(id, {'cmd':cmd, 'uid':uid})

def __add_notice(uid):
    cmd = 'DISPATCH_OL'
    friendids = get_redis().get(uid + '_friendids')
    ids = friendids.split(',')
    for id in ids:
        if(__get_req(id)):
            __send_msg(id, {'cmd':cmd, 'uid':uid})

def __send_msg(uid, msg):
    req = __get_req(uid)
    if(req):
        try:
            req.ws_stream.send_message(simplejson.dumps(msg), binary=False)
            return True
        except Exception as e:
            die_users.append({'uid':uid, 'ts':time.time()})


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
    

def clear_die_user_thread():
    while True:
        if(die_users):
            die_dict = die_users.pop()
            uid = die_dict['uid']
            ts = float(die_dict['ts'])
            if(user_request.has_key(uid)):
                if(float(user_request[uid]['ts']) <= ts):
                    __remove_notice(uid)
                    __remove_user(uid)
            else:
                __remove_notice(uid)
                __remove_user(uid)
        else:
            time.sleep(5)
            
def add_ol_user_thread():
     while True:
        if(add_users.qsize() > 0):
            add_dict = add_users.get_nowait()
            uid = add_dict['uid']
            request = add_dict['req']
            ts = add_dict['ts']
            if(user_request.has_key(uid) and float(user_request[uid]['ts']) > float(ts)):
                pass
            else:
                __add_uid_req(uid, request)
                __add_notice(uid)
                __get_ol(uid)            
        else:
            time.sleep(5)
            
def notice_thread():
    while True:
        notice = get_redis().rpop('notice')
        if(notice):
            try:
                n_dict = simplejson.loads(notice)
                if(n_dict['cmd'] in CMD_CNF):
                    user_exists = user_request.has_key(str(n_dict['to']))
                    if(user_exists):
                        eval(n_dict['cmd'].lower())(n_dict)
                    else:
                        if(n_dict['t'] == 2 and time.time() < n_dict['ex']):
                            get_redis().lpush('notice60' , notice)
            except Exception as e:
                print(e)
        else:
            time.sleep(5)
            
def notice60_thread():
    notice60_key = 'notice60'
    while True:
        notice = get_redis().rpop(notice60_key)
        other_key = 'notice60_bak' if notice60_key == 'notice60' else 'notice60'
        if(notice):
            try:
                n_dict = simplejson.loads(notice)
                if(n_dict['cmd'] in CMD_CNF):
                    user_exists = user_request.has_key(str(n_dict['to']))
                    if(user_exists):
                        eval(n_dict['cmd'].lower())(n_dict)
                    else:
                        if(n_dict['t'] == 2 and time.time() < n_dict['ex']):
                            get_redis().lpush(other_key, notice)
            except Exception as e:
                print(e)
        else:
            notice60_key = other_key
            time.sleep(10)
        

thread.start_new_thread (clear_die_user_thread, ())
thread.start_new_thread (add_ol_user_thread, ())
thread.start_new_thread(notice_thread, ())
thread.start_new_thread(notice60_thread, ())

def ws_dispatch(line, request):
    msg = simplejson.loads(line)
    if(msg):
        if(msg['cmd'] in CMD_CNF):
            eval(msg['cmd'].lower())(request, msg)
        

def apply_group(n_dict):
    __send_msg(str(n_dict['to']), n_dict)
    
def chat(request, msg):
    for to in msg['to']:
        __send_msg(to, {'cmd':msg['cmd'], 'uid':msg['from'], 'msg':msg['msg']})
        
def refresh_ol(request, msg):
    __add_user(msg['uid'], request)
        
    
        
