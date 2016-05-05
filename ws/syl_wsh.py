def web_socket_do_extra_handshake(request):
    pass  # Always accept.


def web_socket_transfer_data(request):
    line = request.ws_stream.receive_message()
    request.ws_stream.send_message(line)
    print(line)