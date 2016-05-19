$(function() {
    syl.ws = {
	url : 'ws://localhost:8889/syl',
	ws : null,
	init : function() {
	    if (!this.ws || this.ws.readyState != this.ws.OPEN) {
		this.ws = new WebSocket(this.url);
		var th = this;
		this.ws.onopen = function(evt) {/*
						 * token = evt.data;
						 * syl.util.ajax_send(null,
						 * 'cust/regws', function(data) {
						 * if (data.level == 1) { if
						 * (data.msg == token) {
						 * console.log('ws connected'); }
						 * else { th.ws.close();
						 * console.log('ws connect
						 * failure'); } } else if
						 * (data.level == 2) {
						 * th.ws.close();
						 * console.log('ws connect
						 * failure'); } });
						 */};
		this.ws.onclose = function(evt) {
		    console.log('ws disconnected');
		};
		this.ws.onmessage = function(evt) {
		    if (evt) {
			console.dir(evt);
		    }
		    $('#chat_content').append('<p>' + decodeURIComponent(evt.data));
		};
		this.ws.onerror = function(evt) {
		    console.log(evt.data);
		};
	    }
	}
    	send:function(line){
    	    if(this.ws){
    		this.ws.send(line);
    	    }
    	}
    }
});
