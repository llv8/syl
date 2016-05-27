$(function() {
    syl.ws = {
	url : 'ws://192.168.0.103:8889/syl',
	ws : null,
	cmd : new Set([ 'CHAT', 'CHECK_OL', 'DISPATCH_OL', 'RECV_LL' ]),
	init : function() {
	    if (!this.ws || this.ws.readyState != this.ws.OPEN) {
		var user = syl.util.get_obj('u');
		this.ws = new WebSocket(this.url + '?i=' + user.i + '&t='
			+ user.t);
		var th = this;
		this.ws.onopen = function(evt) {
		    token = evt.data;
		    syl.util.ajax_send({
			't' : user.t
		    }, 'cust/regws', function(data) {
			if (data.l == 1) {
			    console.log('ws connected');
			} else {
			    th.ws.close();
			    console.log('ws connect failure');
			}
		    });

		};
		this.ws.onclose = function(evt) {
		    console.log('ws disconnected');
		};
		this.ws.onmessage = function(evt) {
		    if (evt.data == null || evt.data == undefined)
			return;
		    var cmds = $.trim(evt.data).split(' ');
		    if (!syl.ws.cmd.has(cmds[0]))
			return;
		    var params = cmds.slice(1);
		    syl.ws[cmds[0].toLowerCase() + '_resp'](params);
		};
		this.ws.onerror = function(evt) {
		    console.log(evt.data);
		};
	    }
	},
	chat_resp : function(params) {
	    if ($.isEmptyObject(params))
		return;
	    syl.touser = syl.util.get_obj('ul')[params[0]];
	    $('#chat_bar').html('@' + syl.touser.n);
	    $('#chat_content')
		    .append(
			    $('<div>')
				    .css({
					'float' : 'left',
					'color' : '#8b0000',
					'clear' : 'both'
				    })
				    .html(
					    syl.touser['n']
						    + '  '
						    + new Date()
							    .format('yyyy-MM-dd hh:mm:ss')))
		    .append($('<div>').css({
			'float' : 'left',
			'color' : '#8b0000',
			'background-color' : '#ffffff',
			'border' : '1px solid',
			'padding' : '5px',
			'border-radius' : '3px',
			'clear' : 'both'
		    }).html(decodeURIComponent(params[1])));
	    $('#chat_content')[0].scrollTop = $('#chat_content')[0].scrollTop + 100000000;
	},
	send : function(line) {
	    this.init();
	    this.ws.send(line);
	},
	check_ol_resp : function(params) {
	    if ($.isEmptyObject(params))
		return;
	    var userlist = syl.util.get_obj('ul');
	    for (var i = 0; i < params.length; i++) {
		userlist[params[i]]['ol'] = 1;
	    }
	    syl.util.set_obj('ul', userlist);
	},
	dispatch_ol_resp : function(params) {
	    if ($.isEmptyObject(params))
		return;
	    var userlist = syl.util.get_obj('ul');
	    userlist[params[0]]['ol'] = 1;
	    syl.util.set_obj('ul', userlist);
	},
	recv_ll_resp : function(params) {
	    if ($.isEmptyObject(params))
		return;
	    var userlist = syl.util.get_obj('ul');
	    userlist[params[0]]['ol'] = 0;
	    syl.util.set_obj('ul', userlist);
	}
    }
});
