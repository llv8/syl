$(function() {
    syl = {
	touserid : null,
	wnd : {
	    list : null,
	    activewnd : null,
	    index : 0,
	    activeele : null,
	    activeselected : 0
	},
	init : function() {
	    this.signin();
	    // this.loadFile();
	    this.registerKey();
	    this.registerFocus();
	    Mousetrap.bind('esc', this.escHandler);
	},
	signin : function() {
	    var user = get_user();
	    if (user) {
		ajax_send({
		    id : user.id,
		    token : user.token,
		    status : user.status
		}, 'cust/signin', function(data) {
		    ajax_main_resp(data, function(data) {
			if (data.level == 1) {
			    set_user(data.user)
			    update_stat(data.user)
			} else if (data.level == 2) {
			    update_stat(null);
			    clear_storage();
			}
		    });
		});
	    } else {
		update_stat(null);
	    }
	},
	registerFocus : function() {
	    syl.wnd.list = $('.wnd');
	    $('input, div[tabIndex]')
		    .focus(
			    function() {
				$('input,div[tabIndex]').css('border-color',
					'#a1a1a1');
				for (var i = 0; i < syl.wnd.list.length; i++) {
				    $(syl.wnd.list[i]).children('.title').css(
					    'opacity', '0.2');
				}
				if ($(this).attr('class') == 'wnd') {
				    $(this).children('.title').css('opacity',
					    '1');
				    syl.wnd.activewnd = $(this);
				} else {
				    $(this).parents('.wnd').children('.title')
					    .css('opacity', '1');
				    syl.wnd.activewnd = $(this).parents('.wnd');
				}
				$(this).css('border-color', '#ffa500');
				syl.wnd.activeele = $(this);
			    });
	    $(syl.wnd.list[0]).focus();
	},
	key_cnf : {
	    'f' : {
		'req' : syl_activeElement,
		'help' : 'active element'
	    },

	    'm' : {
		'req' : syl_maxOrMinWnd,
		'help' : 'maximized window or restore window'
	    },
	    '/' : {
		'req' : syl_find,
		'help' : 'find'
	    },
	    'alt+s' : {
		'req' : syl_switchwnd,
		'help' : 'switch window'
	    },
	    'H' : {
		'req' : syl_moveL,
		'help' : 'extend window left'
	    },
	    'L' : {
		'req' : syl_moveR,
		'help' : 'extend window right'
	    },

	    'n' : {
		'req' : syl_moveNext,
		'help' : 'move to next selected'
	    },
	    'N' : {
		'req' : syl_movePre,
		'help' : 'move to previous selected'
	    },

	    'J' : {
		'req' : syl_moveD,
		'help' : 'extend window down'
	    },
	    'K' : {
		'req' : syl_moveU,
		'help' : 'extend window up'
	    },
	    'h' : {
		'req' : syl_scrollL,
		'help' : 'scroll window left'
	    },
	    'l' : {
		'req' : syl_scrollR,
		'help' : 'scroll window right'
	    },
	    'j' : {
		'req' : syl_scrollD,
		'help' : 'scroll window down'
	    },
	    'k' : {
		'req' : syl_scrollU,
		'help' : 'scroll window up'
	    },
	    'g g' : {
		'req' : syl_firstLine,
		'help' : 'first line'
	    },
	    'G' : {
		'req' : syl_lastLine,
		'help' : 'last line'
	    },
	    'alt+f' : {
		'req' : syl_command,
		'help' : 'command'
	    },
	    'alt+1' : {
		'req' : function(event) {
		    event.preventDefault();
		    syl.wnd.list[0].focus();
		},
		'help' : 'active window 1'
	    },
	    'alt+2' : {
		'req' : function(event) {
		    event.preventDefault();
		    syl.wnd.list[1].focus();
		},
		'help' : 'active window 2'
	    },
	    'alt+3' : {
		'req' : function(event) {
		    event.preventDefault();
		    syl.wnd.list[2].focus();
		},
		'help' : 'active window 3'
	    },
	    'alt+4' : {
		'req' : function(event) {
		    event.preventDefault();
		    syl.wnd.list[3].focus();
		},
		'help' : 'active window 4'
	    },
	    'alt+enter' : {
		'req' : syl_chat_send,
		'help' : 'submit chat message'
	    },
	    '?' : {
		'req' : syl_help,
		'help' : 'help'
	    },
	},

	registerKey : function() {
	    for ( var key in this.key_cnf) {
		Mousetrap.bind(key, this.key_cnf[key]['req']);
	    }
	},
	escHandler : function(event) {
	    if ($('.highlight').length > 0) {
		$(syl.wnd.list).removeHighlight();
	    } else if ($('#mask').css('display') == 'block') {
		$('#mask').css('display', 'none').empty();
	    } else if ($('#fkey').css('display') == 'block') {
		$('#fkey').css('display', 'none').empty();
	    } else {
		var parents = syl.wnd.activeele.parents();
		if (event.keyCode === 27) {
		    for (var i = 0; i < parents.length; i++) {
			if ($(parents[i]).attr('tabIndex')) {
			    $(parents[i]).focus();
			    break;
			}
		    }
		}

	    }
	},
	unregisterKey : function() {
	    for ( var key in this.key_cnf) {
		Mousetrap.unbind(key);
	    }
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

    syl.init();

});

$("#chat_textarea").bind("keydown", function(event) {
    if (event.keyCode === $.ui.keyCode.TAB) {
	event.preventDefault();
    }
    if (event.keyCode === 27) {
	$(this).blur();
	window.getSelection().removeAllRanges();
	var parents = syl.wnd.activeele.parents();
	for (var i = 0; i < parents.length; i++) {
	    if ($(parents[i]).attr('tabIndex')) {
		$(parents[i]).focus();
		break;
	    }
	}

    }
}).autocomplete({
    minLength : 1,
    delay : 10,
    autoFocus : true,

    source : function(request, response) {
	var term = request.term, results = [];
	if (term.indexOf("@") === 0 && term.split("@").length == 2) {
	    var userList = JSON.parse(localStorage.getItem('userlist'));
	    var users = [];

	    $.each(userList, function(i, n) {
		var username = n.username;
		if (n.ids) {
		    username += '(' + n.userids + ')';
		}
		users.push({
		    'label' : username,
		    'id' : n.id
		});
	    });

	    if (term.lenght == 1) {
		results = users;
	    } else {
		var filterUsers = [];
		var matcher = single_match(term.substr(1, term.length));
		var re = new RegExp(matcher);
		$.each(users, function(i, n) {
		    if (n.label.match(re)) {
			filterUsers.push(n);
		    }
		});
		results = filterUsers;
	    }

	} else {
	    results = [];
	}
	response(results);
    },
    position : {
	my : 'left top',
	at : 'left+20px top+20px'
    },
    open : function() {
	$('.ui-autocomplete').css('width', '200px');
    },
    focus : function(event, ui) {
	return false;
    },
    select : function(event, ui) {
	$(this).html('@' + ui.item.label + ':');
	syl.touserid = ui.item.id;
	if (event.keyCode === 13) {
	    var range = document.createRange();
	    var sel = window.getSelection();
	    var nodes = this.childNodes;
	    range.setStart(this.childNodes[0], this.childNodes[0].length);
	    sel.removeAllRanges();
	    sel.addRange(range);
	}
	return false;
    }
}).autocomplete("instance")._renderItem = function(ul, item) {
    var tip = $("<span>").html(item.value).css("color", "#B8B8B8");
    var tip_html = $("<div>").append(tip).html();
    var content = "<a>" + item.label + "</a>";
    return $("<li>").append(content).appendTo(ul);
};

function syl_command(event) {

    event.preventDefault();
    var CMD_CNF = [
	    {
		label : 'register',
		app : 'cust',
		value : 'Li,Lei 18848884888 lilei.gmail.com',
		help : 'params--1:lastname,firstname(real name) 2:phone 3:email.<span style="color:red">(phone and email提交后不可修改)</span>',
		response : syl_resp_register

	    }, {
		label : 'vcode',
		app : 'cust',
		value : 'code',
		help : 'params--1:验证码',
		response : syl_resp_vcode

	    }, {
		label : 'addgroup',
		app : 'cust',
		value : 'groupname',
		help : 'params--1:groupname',
		response : syl_resp_addgroup
	    }, {
		label : 'applygroup',
		app : 'cust',
		value : 'groupname',
		help : 'params--1:groupname',
		response : syl_resp_applygroup
	    }, {
		label : 'approveuser',
		app : 'cust',
		value : 'username',
		help : 'params--1:username',
		response : syl_resp_approveuser
	    }, {
		label : 'login',
		app : 'cust',
		value : '[email|phone]',
		help : 'params--1:email or phone',
		response : syl_resp_login
	    }, {
		label : 'logout',
		app : 'cust',
		value : '',
		help : '',
		response : syl_resp_logout
	    }

    ];
    $('#mask').empty();
    var input = $('<input>').attr('id', 'cmd');
    $('#mask').append(input).css('display', 'block');
    input[0].focus();

    var cmd_obj = {
	minLength : 1,
	delay : 10,
	autoFocus : true,
	source : CMD_CNF,
	position : {
	    my : 'left top',
	    at : 'left bottom'
	},
	search : function(event, ui) {
	    var cmd_tip = '';
	    var cmd_line = $("#cmd").val();
	    if (cmd_line.match(/^approveuser\s+\S*$/)) {
		$("#cmd").autocomplete(approveuser_obj);
	    }
	    if (cmd_line.match(/^applygroup\s+\S*$/)) {
		$("#cmd").autocomplete(applygroup_obj);
	    }
	    if (!cmd_line) {
		$("#msg").empty();
	    }

	    $.each(CMD_CNF, function(i, n) {
		if (cmd_line.match("^" + n.label)) {
		    cmd_tip = n.help;
		}
	    });

	    if (!cmd_tip) {
		syl.showMsg();
	    } else {
		syl.showMsg(cmd_tip, 1);
	    }
	},
	focus : function(event, ui) {
	    return false;
	},
	select : function(event, ui) {
	    if (ui.item.label != 'approveuser' && ui.item.label != 'applygroup') {
		$("#cmd").val(ui.item.label + ' ');
	    } else {
		$("#cmd").val(ui.item.label);
	    }
	    syl.showMsg(ui.item.help, 1);
	    return false;
	}
    };

    var applygroup_obj = {
	source : function(request, response) {
	    var grouplist = get_grouplist();

	    var result = [];
	    if (grouplist) {
		var groups = [];
		var grouped = get_grouped();
		for (var i = 0; i < grouplist.length; i++) {
		    if (!grouped.has(grouplist[i].id)) {
			groups.push(grouplist[i]);
		    }
		}
		if (groups) {
		    var filterGroups = [];
		    var cmd_line = $("#cmd").val();
		    if (!cmd_line.match(/^applygroup\s+$/)) {
			var groupname = cmd_line.substr(cmd_line
				.match(/^applygroup\s+/)[0].length,
				cmd_line.length);
			var matcher = single_match(groupname);
			var re = new RegExp(matcher);
			$.each(groups, function(i, n) {
			    if (n.name.match(re)) {
				filterGroups.push(n);
			    }
			});
		    } else {
			filterGroups = groups;
		    }
		}

		$.each(filterGroups, function(i, n) {
		    result.push({
			label : 'applygroup ' + filterGroups[i].name,
			groupid : filterGroups[i].id,
			value : ' '
		    });
		});

		response(result);
	    }

	},

	search : function(event, ui) {
	    var cmd_line = $("#cmd").val();
	    if (!cmd_line.match(/^applygroup\s+\S*$/)) {
		$("#cmd").autocomplete(cmd_obj);
	    }
	},
	select : function(event, ui) {
	    $(this).autocomplete('option', 'groupid', ui.item.groupid);
	    $("#cmd").val(ui.item.label + ' ');
	    return false;
	}
    }

    var approveuser_obj = {
	source : function(request, response) {
	    var userlist = get_userlist();
	    var result = [];
	    if (userlist) {
		var users = [];

		manager = get_user();
		for (var i = 0; i < userlist.length; i++) {
		    if (manager.id == userlist[i].managerid
			    && userlist[i].status == 0) {
			users.push(userlist[i]);
		    }
		}
		if (users) {
		    var filterUsers = [];
		    var cmd_line = $("#cmd").val();
		    if (!cmd_line.match(/^approveuser\s+$/)) {
			var username = cmd_line.substr(cmd_line
				.match(/^approveuser\s+/)[0].length,
				cmd_line.length);
			var matcher = single_match(username);
			var re = new RegExp(matcher);
			$.each(users, function(i, n) {
			    if (n.username.match(re)) {
				filterUsers.push(n);
			    }
			});
		    } else {
			filterUsers = users;
		    }
		}

		$.each(filterUsers, function(i, n) {
		    result.push({
			label : 'approveuser ' + filterUsers[i].username
				+ ' apply for ' + filterUsers[i].groupname,
			userid : filterUsers[i].id,
			value : ' '
		    });
		});

		response(result);
	    }

	},

	search : function(event, ui) {
	    var cmd_line = $("#cmd").val();
	    if (!cmd_line.match(/^approveuser\s+\S*$/)) {
		$("#cmd").autocomplete(cmd_obj);
	    }
	},
	select : function(event, ui) {
	    $(this).autocomplete('option', 'userid', ui.item.userid);
	    $("#cmd").val(ui.item.label + ' ');
	    return false;
	}
    }
    $("#cmd")
	    .autocomplete(cmd_obj)
	    .keydown(function(event) {
		if (event.keyCode === $.ui.keyCode.TAB) {
		    event.preventDefault();
		}
	    })
	    .keypress(
		    function(event) {
			if (event.keyCode === 13) {
			    var cmd_line = $("#cmd").val();
			    var cmd = null;
			    $.each(CMD_CNF, function(i, n) {
				if (cmd_line.match('^' + n.label)) {
				    cmd = n;
				}
			    });

			    if (!cmd) {
				syl.showMsg('Can not find command', 2);
			    } else {
				var err_msg = '';

				if (cmd.valid) {
				    err_msg = cmd.valid(cmd_line);
				}

				if (err_msg) {
				    syl.showMsg(err_msg, 2);
				} else {

				    if (cmd_line.match(/applygroup\s+/)) {
					groupname = cmd_line.replace(
						/applygroup\s+/, '').trim();
					var grouplist = get_grouplist();
					for (var i = 0; i < grouplist.length; i++) {
					    if (grouplist[i].name.trim() == groupname) {
						cmd_line = 'applygroup '
							+ grouplist[i].id;
						break;
					    }
					}
				    }

				    if (cmd_line.match(/approveuser\s+/)) {
					username = cmd_line.replace(
						/approveuser\s+/, '').trim();
					var userlist = get_userlist();
					for (var i = 0; i < grouplist.length; i++) {
					    if (userlist[i].username.trim() == username) {
						cmd_line = 'approveuser '
							+ userlist[i].userid;
						break;
					    }
					}
				    }

				    $('#cmd').attr('readonly', 'readonly');
				    cmd.cmd_line = cmd_line;
				    $
					    .ajax({
						type : 'POST',
						data : 'cmd=' + cmd_line,
						dataType : 'json',
						url : cmd.app + '/' + cmd.label,
						headers : {
						    'X-CSRFToken' : syl_getCookie('csrftoken')
						},
						success : function(data) {
						    cmd.response(data);
						    if ($('#cmd')) {
							$('#cmd').removeAttr(
								'readonly');
						    }
						}
					    });
				}
			    }
			}
		    }).keyup(function(event) {
		if (event.keyCode === 27) {
		    syl.showMsg();
		    $('#mask').css('display', 'none').empty();
		}
	    }).autocomplete("instance")._renderItem = function(ul, item) {
	$(ul).css('font-size', '25px');
	var tip = $("<span>").html(item.value).css("color", "#B8B8B8");

	var tip_html = $("<div>").append(tip).html();
	var content = "<a>" + item.label + " " + tip_html + "</a>";

	return $("<li>").append(content).appendTo(ul);
    };
}

function syl_chat_send(event) {
    if (event.keyCode == 64 && $('#chat_content').val() == '') {

	var userList = JSON.parse(localStorage.getItem('userlist'));

    } else if (event.keyCode == 64 && $('#chat_content').val() == '@') {

    } else if (event.keyCode == 13) {
	if (syl.touserid) {
	    if (!$(syl.wnd.activeele).is($('#chat_textarea')))
		return;
	    var cmd = 'SC';
	    var fromuser = get_user();
	    if (!fromuser || fromuser.status != 1 || !fromuser.token)
		return;
	    var from = fromuser.id;
	    var to = syl.touserid;
	    var content = $('#chat_textarea').html();
	    var msg = cmd + ' ' + from + ' ' + to + ' ' + content;
	    get_ws().send(msg);

	}
    }

}
