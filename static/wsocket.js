var wsUri = "ws://localhost:8889/syl";
var websocket = new WebSocket(wsUri);

websocket.onopen = function(evt) {
    console.log('ws connected');
};
websocket.onclose = function(evt) {
    console.log('ws disConnected');
};
websocket.onmessage = function(evt) {
    $('#chat_content').append('<p>' + evt.data);
};
websocket.onerror = function(evt) {
    console.log(evt.data);
};

function syl_send(msg) {
    if (!websocket && websocket.readyState == websocket.OPEN) {
	// do nothing
    } else {
	websocket = new WebSocket(wsUri);
    }
    websocket.send(msg);
}

function syl_send_resp(event) {

}

var MSG_CMD_TYPE = {
    CHAT : 1,
    ACK : 2
};

function syl_chat_msg(msg) {
    if (!syl.user) {
	syl.showMsg('fist login or register!', 2);
	return;
    }

    if (!syl.touserid) {
	syl.showMsg('to user is null!', 2);
	return;
    }

    return {
	'msg' : msg,
	'to' : syl.touserid,
	'from' : syl.user.id,
	'type' : MSG_CMD_TYPE.CHAT
    }
}