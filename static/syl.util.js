syl = {}
$(function() {
    syl.util = {
	signin : function() {
	    var user = this.get_obj('user');
	    var th = this;
	    if (user) {
		this.ajax_send({
		    id : user.id,
		    token : user.token,
		    status : user.status
		}, 'cust/signin', function(data) {
		    th.ajax_main_resp(data, function(data) {
			if (data.level == 1) {
			    th.set_obj('user', data.user)
			    th.update_stat(data.user)
			    syl.ws.init();
			} else if (data.level == 2) {
			    th.update_stat(null);
			    th.clear_storage();
			}
		    });
		});
	    } else {
		this.update_stat(null);
	    }
	},
	ajax_send : function(params, url, fn) {
	    var th = this;
	    $.ajax({
		type : 'POST',
		data : params,
		dataType : 'json',
		url : url,
		headers : {
		    'X-CSRFToken' : th.get_cookie('csrftoken')
		},
		success : function(data) {
		    if (fn) {
			fn(data);
		    }
		}
	    });
	},

	update_locallist : function(list, key) {
	    if (list) {
		var l = this.get_obj(key);

		if (l) {
		    var l_map = {};
		    for (var i = 0; i < l.length; i++) {
			l_map[l[i].id] = l[i];
		    }

		    for (var i = 0; i < list.length; i++) {
			if (list[i].status == -1) {
			    delete l_map[list[i].id];
			} else {
			    l_map[list[i].id] = list[i];
			}
		    }
		    var update_l = [];
		    for ( var id in l_map) {
			update_l.push(l_map[id]);
		    }
		    update_l.sort(function(a, b) {
			return a.name > b.name;
		    });
		    this.set_obj(key, update_l);
		} else {
		    this.set_obj(key, list);
		}
	    }
	},

	get_cookie : function(name) {
	    var cookieValue = null;
	    if (document.cookie) {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
		    var cookie = $.trim(cookies[i]);
		    if (cookie.substring(0, name.length + 1) == (name + '=')) {
			cookieValue = decodeURIComponent(cookie
				.substring(name.length + 1));
			break;
		    }
		}
	    }
	    return cookieValue;
	},

	get_grouped : function() {
	    var userlist = get_obj('userlist');
	    var set = new Set();
	    for (var i = 0; i < userlist.length; i++) {
		set.add(userlist[i].groupid);
	    }
	    return set;
	},

	get_obj : function(key) {
	    var str = localStorage.getItem(key);
	    if (str) {
		return JSON.parse(str);
	    }
	    return null;
	},

	set_obj : function(key, obj) {
	    localStorage.setItem(key, JSON.stringify(obj));
	},

	clear_storage : function() {
	    localStorage.clear();
	},

	ajax_resp : function(data) {
	    if (data.level == 2) {
		this.showMsg(data.msg, data.level);
	    } else {
		this.showMsg(data.msg, 1);
	    }
	},

	ajax_main_resp : function(data, fn) {
	    this.ajax_resp(data);
	    if (fn) {
		fn(data);
	    }
	},
	ajax_mask_resp : function(data, fn) {
	    this.ajax_main_resp(data, fn);
	    if (data.level == 1) {
		this.mask_empty();
	    }
	},

	single_match : function(str) {
	    return ".*" + str.split("").join(".*") + ".*";
	},

	update_stat : function(user) {
	    if (!user) {
		$('#stat').html('No Signed');
		return;
	    }
	    $('#stat').html(
		    '<span style="color:'
			    + (user.status == 1 ? 'green' : 'red') + '">'
			    + user.name + '</span>');
	},

	mask_empty : function() {
	    $('#mask').css('display', 'none').empty();
	},
	showMsg : function(msg, level) {
	    $('#msg').empty();
	    if (!level) {
		levle = 1;
	    }

	    // level--1:info,2:error
	    $('#msg').html(msg).css('display', 'block').css('color',
		    level === 1 ? 'green' : (level === 2 ? 'red' : ''));

	},
	showMask : function(msg) {
	    $('#mask').empty();
	    $('#mask').html(msg).css('display', 'block');

	}
    }
});
