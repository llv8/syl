MSG_CMD_TYPE = {
    'CHAT' : 1,
    'ACK' : 2
};

def web_socket_do_extra_handshake(request):
    print(request)

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
        
