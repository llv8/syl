$(function() {
    var util = {
	    ajax_send:function(params, url, fn) {
	$.ajax({
	    type : 'POST',
	    data : params,
	    dataType : 'json',
	    url : url,
	    headers : {
		'X-CSRFToken' : syl_getCookie('csrftoken')
	    },
	    success : function(data) {
		if (fn) {
		    fn(data);
		}
	    }
	});
    }

    update_locallist :function(list, key) {
	if (list) {
	    var l = JSON.parse(localStorage.getItem(key));

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
		localStorage.setItem(key, JSON.stringify(update_l));
	    } else {
		localStorage.setItem(key, JSON.stringify(list));
	    }
	}
    }

    syl_getCookie: function(name) {
	var cookieValue = null;
	if (document.cookie && document.cookie != '') {
	    var cookies = document.cookie.split(';');
	    for (var i = 0; i < cookies.length; i++) {
		var cookie = jQuery.trim(cookies[i]);
		if (cookie.substring(0, name.length + 1) == (name + '=')) {
		    cookieValue = decodeURIComponent(cookie
			    .substring(name.length + 1));
		    break;
		}
	    }
	}
	return cookieValue;
    }

    get_userlist:function() {
	var str = localStorage.getItem('userlist');
	if (str) {
	    return JSON.parse(str);
	}
	return null;
    }

    get_grouped:function() {
	var userlist = get_userlist();
	var set = new Set();
	for (var i = 0; i < userlist.length; i++) {
	    set.add(userlist[i].groupid);
	}
	return set;
    }

    get_grouplist: function() {
	var str = localStorage.getItem('grouplist');
	if (str) {
	    return JSON.parse(str);
	}
	return null;
    }

    get_user:function(key) {
	var str = localStorage.getItem(key);
	if (str) {
	    return JSON.parse(str);
	}
	return null;
    }

    set_user:function (key,obj) {
	localStorage.setItem(key, JSON.stringify(obj));
    }

    clear_storage:function() {
	localStorage.clear();
    }

    ajax_resp:function(data) {
	if (data.level == 2) {
	    syl.showMsg(data.msg, data.level);
	} else {
	    syl.showMsg(data.msg, 1);
	}
    }

    ajax_main_resp:function(data, fn) {
	ajax_resp(data);
	if (fn) {
	    fn(data);
	}
    }

    ajax_mask_resp:function(data, fn) {
	this.ajax_main_resp(data,fn);
	if (data.level == 1) {
	    mask_empty();
	}
    }

    single_match:function(str) {
	return ".*" + str.split("").join(".*") + ".*";
    }

    update_stat:function(user) {
	if (!user) {
	    $('#stat').html('No Signed');
	    return;
	}
	$('#stat').html(
		'<span style="color:' + (user.status == 1 ? 'green' : 'red')
			+ '">' + user.name + '</span>');
    }

    mask_empty:function() {
	$('#mask').css('display', 'none').empty();
    }
    };
})
