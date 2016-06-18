var ws_scheme = window.location.protocol == 'https:' ? 'wss://' : 'ws://';
$(function() {
  syl.ws = {
    url: ws_scheme + window.location.hostname+':8889/syl',
    ws: null,
    heartbeatid: null,
    checkolid: null,
    cmd: new Set(['CHAT', 'CHECK_OL', 'HEART_BEAT', 'ACK', 'APPLY_GROUP',
        'APPROVE_USER', 'CHAT_ACK', 'CHAT_LOG', 'HACK_NOTICE']),
    heart_beat: function() {
      syl.ws.init();
      syl.ws.heartbeatid = setInterval(function() {
        syl.ws.init();
      }, syl.ws_hb);
    },
    succ_init: function() {
      syl.fs.load_records();
      if (syl.ws.checkolid) clearInterval(syl.ws.checkolid);
      syl.ws.checkolid = setInterval("syl.ws.check_ol()", syl.ws_check_ol);
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
              console.log('ws connected');
              syl.ws.succ_init();
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
      if (syl.ws.heartbeatid) clearInterval(syl.ws.heartbeatid);
      syl.ws.ws.close();
    },
    get_chat_filename: function(record) {
      return syl.util.get_date(record['t'], 'yyyyMMdd') + '-chat-'
              + syl.util.get_id();
    },
    chat_log_resp: function(msg) {
      var all_len = 0;
      if (msg['msgs']) {
        var keys = [];
        for ( var key in msg['msgs']) {
          keys.push(key);
        }
        keys = keys.sort();

        for (var i = 0; i < keys.length; i++) {
          // var record = JSON.parse(msg['msgs'][i]);
          var records = [];
          for (var j = 0; j < msg['msgs'][keys[i]].length; j++) {
            records.push(JSON.parse(msg['msgs'][keys[i]][j]));
          }
          all_len += records.length;
          if (!$.isEmptyObject(records))
            syl.fs.write_records(keys[i] + '-chat-' + syl.util.get_id(),
                    records, syl.ws.show_records);
        }
      }
      if (all_len == 0) {
        syl.ws.show_records();
      }
    },
    show_records: function() {
      $('#chat_content').empty();
      var id = syl.util.get_id();
      var filename = syl.util.get_b('lastr-' + id) + '-chat-' + id;

      syl.fs.read_records(filename, function(records) {
        for ( var i in records) {
          if (records[i]['from'] == syl.util.get_id()) {
            syl.ws.render_from(records[i]);
          } else {
            syl.ws.render_to(records[i]);
          }
        }
      }, 100);
    },
    chat_resp: function(msg) {
      syl.ws.render_to(msg);
      syl.fs.write_records(syl.ws.get_chat_filename(msg), msg);
    },

    chat_ack_resp: function(msg) {
      var content = $('#chat_textarea').html();
      content = content.replace(/@[a-zA-Z0-9,]+:/, '');
      msg['msg'] = content;
      syl.ws.render_from(msg);
      var from = syl.util.get_id();
      var filename = syl.util.get_date(msg['t'], 'yyyyMMdd') + '-chat-' + from;
      msg['msg'] = encodeURIComponent(msg['msg']);
      syl.fs.write_records(filename, msg);
    },
    render_from: function(msg) {
      $('#chat_textarea').empty();
      var time = syl.util.get_date(msg['t'], 'MM-dd hh:mm:ss');
      var toname = null;
      if (msg['to'] >= 100000) {
        toname = syl.util.get_obj('ul')[msg['to']]['n'];
      } else {
        toname = syl.util.get_obj('gl')[msg['to']]['n'];
      }
      $('#chat_content').append(
              $('<div class="from">').html('@' + toname + '  ' + time)).append(
              $('<div class="from msg">').html(decodeURIComponent(msg['msg'])));
      $('#chat_content')[0].scrollTop = $('#chat_content')[0].scrollTop + 100000000;
    },
    render_to: function(msg) {
      var time = syl.util.get_date(msg['t'], 'MM-dd hh:mm:ss');
      var username = null;
      if (msg['gid']) {
        username = syl.util.get_obj('gl')[msg['gid']]['n'] + '('
                + syl.util.get_obj('ul')[msg['from']]['n'] + ')';
      } else {
        username = syl.util.get_obj('ul')[msg['from']]['n'];
      }
      $('#chat_content').append(
              $('<div class="to">').html(username + '  ' + time)).append(
              $('<div class="to msg">').html(decodeURIComponent(msg['msg'])));
      $('#chat_content')[0].scrollTop = $('#chat_content')[0].scrollTop + 100000000;
    },
    send: function(obj) {
      this.ws.send(JSON.stringify(obj));
    },
    check_ol: function() {
      var cmd = 'CHECK_OL';
      syl.ws.send({
        'cmd': cmd,
        'uid': syl.util.get_id()
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
      $('#popup_content').html(
              '<div class="notice">' + notice + '</div>'
                      + $('#popup_content').html());
      syl.fs.write_records('notice-' + syl.util.get_id(), notice + '\n');
      syl.key.open_popup();
    },
    approve_user_resp: function(msg) {
      syl.util.ajax_send({
        'gid': msg['gid']
      }, 'cust/getgroupusers', function(data) {
        if (data.l == 1) {
          syl.util.update_userlist(data['ul']);
          syl.util.showMsg(null, 1);
          var notice = '您已加入' + syl.util.get_obj('gl')[msg['gid']]['n'];
          $('#popup .worker').append($('<div class="notice">').html(notice));
          syl.key.open_popup();
        }
      });
    },
    heart_beat_resp: function(msg) {
    },
    hack_notice_resp: function(msg) {
      var notice = msg['notice'];
      $('#popup_content').html(
              '<div class="notice">' + notice + '</div>'
                      + $('#popup_content').html());
      syl.fs.write_records('notice-' + syl.util.get_id(), notice + '\n');
      syl.key.open_popup();
    }
  }

});
