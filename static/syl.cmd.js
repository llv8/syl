$(function() {
    function command(event) {
	event.preventDefault();
	var CMD_CNF = [
		{
		    label : 'register',
		    app : 'cust',
		    value : 'Li,Lei 18848884888 lilei.gmail.com',
		    help : 'params--1:lastname,firstname(real name) 2:phone 3:email.<span style="color:red">(phone and email提交后不可修改)</span>',
		    response : syl.resp.register

		}, {
		    label : 'vcode',
		    app : 'cust',
		    value : 'code',
		    help : 'params--1:验证码',
		    response : syl.resp.vcode

		}, {
		    label : 'addgroup',
		    app : 'cust',
		    value : 'groupname',
		    help : 'params--1:groupname',
		    response : syl.resp.addgroup
		}, {
		    label : 'applygroup',
		    app : 'cust',
		    value : 'groupname',
		    help : 'params--1:groupname',
		    response : syl.resp.applygroup
		}, {
		    label : 'approveuser',
		    app : 'cust',
		    value : 'username',
		    help : 'params--1:username',
		    response : syl.resp.approveuser
		}, {
		    label : 'login',
		    app : 'cust',
		    value : '[email|phone]',
		    help : 'params--1:email or phone',
		    response : syl.resp.login
		}, {
		    label : 'logout',
		    app : 'cust',
		    value : '',
		    help : '',
		    response : syl.resp.logout
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
		    syl.util.showMsg();
		} else {
		    syl.util.showMsg(cmd_tip, 1);
		}
	    },
	    focus : function(event, ui) {
		return false;
	    },
	    select : function(event, ui) {
		if (ui.item.label != 'approveuser'
			&& ui.item.label != 'applygroup') {
		    $("#cmd").val(ui.item.label + ' ');
		} else {
		    $("#cmd").val(ui.item.label);
		}
		syl.util.showMsg(ui.item.help, 1);
		return false;
	    }
	};

	var applygroup_obj = {
	    source : function(request, response) {
		var grouplist = get_obj('grouplist');

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
		var userlist = get_obj('userlist');
		var result = [];
		if (userlist) {
		    var users = [];

		    manager = get_obj('user');
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
				    syl.util.showMsg('Can not find command', 2);
				} else {
				    var err_msg = '';

				    if (cmd.valid) {
					err_msg = cmd.valid(cmd_line);
				    }

				    if (err_msg) {
					syl.util.showMsg(err_msg, 2);
				    } else {

					if (cmd_line.match(/applygroup\s+/)) {
					    groupname = cmd_line.replace(
						    /applygroup\s+/, '').trim();
					    var grouplist = get_obj('grouplist');
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
						    /approveuser\s+/, '')
						    .trim();
					    var userlist = get_obj('userlist');
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
						    url : cmd.app + '/'
							    + cmd.label,
						    headers : {
							'X-CSRFToken' : syl.util
								.get_cookie('csrftoken')
						    },
						    success : function(data) {
							cmd.response(data);
							if ($('#cmd')) {
							    $('#cmd')
								    .removeAttr(
									    'readonly');
							}
						    }
						});
				    }
				}
			    }
			}).keyup(function(event) {
		    if (event.keyCode === 27) {
			syl.util.showMsg();
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
    syl.key.command = command;
    syl.key.init();
});
