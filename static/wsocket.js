var syl_wsuri = "ws://siyuel.com:8889/syl";
var syl_websocket = null;
function get_ws() {

  if (!syl_websocket || syl_websocket.readyState != syl_websocket.OPEN) {
    syl_websocket = new WebSocket(syl_wsuri);
    syl_websocket.onopen = function(evt) {
      console.log('ws connected');
    };
    syl_websocket.onclose = function(evt) {
      console.log('ws disConnected');
    };
    syl_websocket.onmessage = function(evt) {
      if (evt) {
        console.dir(evt);
      }
      $('#chat_content').append('<p>' + evt.data);
    };
    syl_websocket.onerror = function(evt) {
      console.log(evt.data);
    };
  }

  return syl_websocket;

}

get_ws();

function syl_send(msg) {
  syl_websocket.send(msg);
}

function syl_send_resp(event) {

}

var MSG_CMD_TYPE = {
  CHAT: 1,
  ACK: 2
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
    'msg': msg,
    'to': syl.touserid,
    'from': syl.user.id,
    'type': MSG_CMD_TYPE.CHAT
  }
}