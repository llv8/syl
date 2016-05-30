$(function() {
    syl.ws = {
	url : 'ws://192.168.0.104:8889/syl',
	ws : null,
	cmd : new Set([ 'CHAT', 'CHECK_OL', 'DISPATCH_OL', 'RECV_LL',
		'APPLY_GROUP' ]),
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
		    var msg = JSON.parse(evt.data);
		    if (!syl.ws.cmd.has(msg['cmd']))
			return;
		    syl.ws[msg['cmd'].toLowerCase() + '_resp'](msg);
		};
		this.ws.onerror = function(evt) {
		    console.log(evt.data);
		};
	    }
	},
	chat_resp : function(msg) {
	    if ($.isEmptyObject(msg))
		return;
	    syl.touser = syl.util.get_obj('ul')[msg['uid']];
	    syl.touser['i'] = msg['uid'];
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
		    }).html(decodeURIComponent(msg['msg'])));
	    $('#chat_content')[0].scrollTop = $('#chat_content')[0].scrollTop + 100000000;
	},
	send : function(obj) {
	    this.init();
	    this.ws.send(JSON.stringify(obj));
	},
	check_ol_resp : function(msg) {
	    if ($.isEmptyObject(msg))
		return;
	    var userlist = syl.util.get_obj('ul');
	    for (var i = 0; i < msg['uids'].length; i++) {
		userlist[msg['uids'][i]]['ol'] = 1;
	    }
	    syl.util.set_obj('ul', userlist);
	},
	dispatch_ol_resp : function(msg) {
	    if ($.isEmptyObject(msg))
		return;
	    var userlist = syl.util.get_obj('ul');
	    userlist[msg['uid']]['ol'] = 1;
	    syl.util.set_obj('ul', userlist);
	},
	recv_ll_resp : function(msg) {
	    if ($.isEmptyObject(msg))
		return;
	    var userlist = syl.util.get_obj('ul');
	    userlist[msg['uid']]['ol'] = 0;
	    syl.util.set_obj('ul', userlist);
	},
	apply_group_resp : function(msg) {
	    var groupname = syl.util.get_obj('gl')[msg['gid']]['n'];
	    var userid = msg['uid'];
	    var username = msg['un'];
	    var approveuserlist = syl.util.get_obj('aul');
	    approveuserlist[userid] = {
		'i' : userid,
		'n' : username,
		'gi' : msg['gid'],
		'gn' : groupname
	    }
	    syl.util.set_obj('aul', approveuserlist)
	    var notice = username + '申请加入' + groupname;
	    $('#popup .worker').append($('<div class="notice">').css({
		'margin' : '10px'
	    }).html(notice));
	    syl.key.open_popup();
	}
    }
});
