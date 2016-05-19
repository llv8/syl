from __builtin__ import eval
import random
import re
import thread

import redis


pool = redis.ConnectionPool(host='192.168.0.108', port=6379, max_connections=10)
def get_redis():
    return redis.Redis(connection_pool=pool)

MSG_CMD_TYPE = {
    'CHAT' : 1,
    'ACK' : 2
};


user_request = {}

def web_socket_do_extra_handshake(request):
    if(re.match(r'^/syl\?userid=[0-9]+$', request.uri)):
        userid = request.uri.split('=')[1]
        user_request[userid] = request
    

def web_socket_passive_closing_handshake(request):
    print('close')

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
    params = re.split('\s+', line)
    if(params):
        if(params[0] in CMD_CNF):
            eval(params[0].lower())(request, params[1:])
        

CMD_CNF = set(['REGISTER', 'VALID_REGISTER', 'CHAT'])

def register(request, params):
        if(request in user_request):
            userid = params[0]
            token = params[1]
            user = get_redis().get(userid)
            if(user):
                pass
            
        request.close()
        
def chat(request, params):
    frm = params[0]
    to = params[1]
    content = params[2]
    user_request[to].ws_stream.send_message(content, binary=False)
    
    
    
        
