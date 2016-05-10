MSG_CMD_TYPE = {
    'CHAT' : 1,
    'ACK' : 2
};

def web_socket_do_extra_handshake(request):
    pass  # Always accept.


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
    print(line)
