import random
import re

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
        token = random.randint(1000, 9999)
        get_redis().set_str(userid + '_ws', token , 60)

        request.ws_stream.send_message(token, binary=False)

def web_socket_passive_closing_handshake(request):
    print(333)

def web_socket_transfer_data(request):
    
    while True:
        line = request.ws_stream.receive_message()
        if line is None:
            return
        if isinstance(line, unicode):
            ws_dispatch(line)
        else:
            # request.ws_stream.send_message(line, binary=True)
            pass
        
def ws_dispatch(line):
    print(444)
    return
    msgs = line.split(' ')
    if(msgs[0] == 'SC'):
        f = msgs[1]
        t = msgs[2]
        len = len(msgs[0] + msgs[1] + msgs[2]) + 3
        c = line[len:]
        
