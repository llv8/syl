            function send() {
                if (event.keyCode == 13) {
                    doSend($('#chat_textarea').val());
                    $('#chat_content').append('<p>' + $('#chat_textarea').val());
                    $("#chat_textarea").val("");
                }
            }


            var wsUri = "ws://localhost:8889/syl";


            function init() {
                websocket = new WebSocket(wsUri);
                websocket.onopen = function(evt) {
                    onOpen(evt)
                };
                websocket.onclose = function(evt) {
                    onClose(evt)
                };
                websocket.onmessage = function(evt) {
                    onMessage(evt)
                };
                websocket.onerror = function(evt) {
                    onError(evt)
                };
            }

            function onOpen(evt) {
                console.log('Connected');
            }

            function onClose(evt) {
                console.log('DisConnected');
            }

            function onMessage(evt) {
                $('#chat_content').append('<p>' + evt.data);
            }

            function onError(evt) {
                console.log(evt.data);
            }

            function doSend(message) {
                websocket.send(message);
            }


            window.addEventListener("load", init, false);
