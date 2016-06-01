$(function() {
  syl.ws = {
    url: 'ws://192.168.0.108:8889/syl',
    ws: null,
    testid: null,
    checkolid: null,
    cmd: new Set(['CHAT', 'CHECK_OL', 'HEART_BEAT', 'ACK', 'APPLY_GROUP',
        'APPROVE_USER','CHAT_ACK']),
    test: function() {
      syl.ws.init();
      syl.ws.testid = setInterval(function() {
        syl.ws.init();
      }, 10 * 1000);
    },
    init: function() {
      if (!this.ws || this.ws.readyState != this.ws.OPEN) {
        var user = syl.util.get_obj('u');
        this.ws = new WebSocket(this.url + '?i=' + user.i + '&t=' + user.t);
        var th = this;
        this.ws.onopen = function(evt) {
          token = evt.data;
          syl.util.ajax_send({
            't': user.t
          }, 'cust/regws', function(data) {
            if (data.l == 1) {
              syl.ws.check_ol();
              syl.ws.checkolid = setInterval("syl.ws.check_ol()", 10 * 1000);
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
          if (evt.data == null || evt.data == undefined) return;
          var msg = JSON.parse(evt.data);
          if (!syl.ws.cmd.has(msg['cmd'])) return;
          syl.ws[msg['cmd'].toLowerCase() + '_resp'](msg);
        };
        this.ws.onerror = function(evt) {
          console.log(evt.data);
        };
      }
    },
    close: function() {
      if (syl.ws.checkolid) clearInterval(syl.ws.checkolid);
      if (syl.ws.testid) clearInterval(syl.ws.testid);
      syl.ws.ws.close();
    },
    chat_resp: function(msg) {
      if ($.isEmptyObject(msg)) return;
      if(!syl.touser){
	    syl.touser = syl.util.get_obj('ul')[msg['from']];
	    syl.touser['i'] = msg['from'];
      }
      $('#chat_bar').html('@' + syl.touser.n);
      var d = new Date();
      d.setTime(msg['t']*1000);
      var time = d.format('MM-dd hh:mm:ss');
      $('#chat_content').append(
              $('<div>').css({
                'float': 'left',
                'color': '#8b0000',
                'clear': 'both'
              }).html(
                      syl.touser['n'] + '  '
                              + time))
              .append($('<div>').css({
                'float': 'left',
                'color': '#8b0000',
                'background-color': '#ffffff',
                'border': '1px solid',
                'padding': '5px',
                'border-radius': '3px',
                'clear': 'both'
              }).html(decodeURIComponent(msg['msg'])));
      $('#chat_content')[0].scrollTop = $('#chat_content')[0].scrollTop + 100000000;
      
      var filename = d.format('yyyyMMdd')+'-chat-'+syl.util.get_obj('u')['i'];
      syl.fs.write(filename,JSON.stringify(msg)+'\n');
    },
    
    chat_ack:function(msg){
	var content = $('#chat_textarea').html();
	content = content.replace(/@[a-zA-Z0-9,]+:/, '');
	$('#chat_textarea').empty();
	var d = new Date();
	d.setTime(msg['t']*1000);
	var time = d.format('MM-dd hh:mm:ss');
	$('#chat_content').append($('<div>').css({
	    'float' : 'right',
	    'color' : '#008000',
	    'clear' : 'both'
	}).html('@' + syl.touser.n + '  ' + time)).append(
		$('<div>').css({
		    'float' : 'right',
		    'color' : '#008000',
		    'background-color' : '#ffffff',
		    'border' : '1px solid',
		    'padding' : '5px',
		    'border-radius' : '3px',
		    'clear' : 'both'
		}).html(content));
	$('#chat_content')[0].scrollTop = $('#chat_content')[0].scrollTop + 100000000;
	var from = syl.util.get_obj('u')['i'];
	var to = syl.touser['i'];
	var filename = d.format('yyyyMMdd')+'-chat-'+from;
	msg['msg'] = content;
	syl.fs.write(filename,JSON.stringify(msg)+'\n');
    }
    send: function(obj) {
      this.ws.send(JSON.stringify(obj));
    },
    check_ol: function() {
      var cmd = 'CHECK_OL';
      syl.ws.send({
        'cmd': cmd,
        'uid': syl.util.get_obj('u')['i']
      });
    },
    check_ol_resp: function(msg) {
      if ($.isEmptyObject(msg)) return;
      var userlist = syl.util.get_obj('ul');
      var oluids = new Set(msg['uids']);
      for ( var key in userlist) {
        if (oluids.has(key)) {
          userlist[key]['ol'] = 1;
        } else {
          userlist[key]['ol'] = 0;
        }
      }
      syl.util.set_obj('ul', userlist);
    },
    apply_group_resp: function(msg) {
      var groupname = syl.util.get_obj('gl')[msg['gid']]['n'];
      var userid = msg['uid'];
      var username = msg['un'];
      var approveuserlist = syl.util.get_obj('aul');
      approveuserlist[userid] = {
        'i': userid,
        'n': username,
        'gi': msg['gid'],
        'gn': groupname
      }
      syl.util.set_obj('aul', approveuserlist)
      var notice = username + '申请加入' + groupname;
      $('#popup .worker').append($('<div class="notice">').css({
        'margin': '10px'
      }).html(notice));
      syl.fs.write('notice-'+syl.util.get_obj('u')['i'],notice+'\n');
      syl.key.open_popup();
    },
    approve_user_resp: function(msg) {
      syl.util.ajax_send({
        'gid': msg['gid']
      }, 'cust/getgroupusers', function(data) {
        if (data.l == 1) {
          syl.util.update_userlist(data['ul'])
        }
      });
    },
    heart_beat_resp: function(msg) {
    }

  }

});
