           
            var wsUri = "ws://localhost:8889/syl";

            function ws_send() {
                if (event.keyCode == 13) {
                    websocket.send($('#chat_textarea').val());
                    $('#chat_content').append('<p>' + $('#chat_textarea').val());
                    $("#chat_textarea").val("");
                }
            }

            function ws_init() {
                websocket = new WebSocket(wsUri);
                websocket.onopen = function(evt) {
                    console.log('Connected');
                };
                websocket.onclose = function(evt) {
                    console.log('DisConnected');
                };
                websocket.onmessage = function(evt) {
                    $('#chat_content').append('<p>' + evt.data);
                };
                websocket.onerror = function(evt) {
                    console.log(evt.data);
                };
            }

