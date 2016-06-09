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
	var input = $('<input id="cmd">');
	$('#mask').append(input).removeClass('ndp').addClass('dp');
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
		Mousetrap.trigger('space');
		return false;
	    }
	};

	var applygroup_obj = {
	    source : function(request, response) {
		var grouplist = syl.util.get_obj('gl');

		var result = [];
		var groups = [];
		var grouped = syl.util.get_joined_group();
		for ( var key in grouplist) {
		    if (!grouped.has(key)) {
			grouplist[key]['i'] = key;
			groups.push(grouplist[key]);
		    }
		}
		if (groups) {
		    var filterGroups = [];
		    var cmd_line = $("#cmd").val();
		    if (!cmd_line.match(/^applygroup\s+$/)) {
			var groupname = cmd_line.substr(cmd_line
				.match(/^applygroup\s+/)[0].length,
				cmd_line.length);
			var matcher = syl.util.single_match(groupname);
			var re = new RegExp(matcher);
			$.each(groups, function(i, n) {
			    if (n.n.match(re)) {
				filterGroups.push(n);
			    }
			});
		    } else {
			filterGroups = groups;
		    }
		}

		$.each(filterGroups, function(i, n) {
		    result.push({
			label : 'applygroup ' + filterGroups[i].n,
			groupid : filterGroups[i].i,
			value : ' '
		    });
		});

		response(result);

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
		var approveuserlist = syl.util.get_obj('aul');
		var grouplist = syl.util.get_obj('gl');
		var result = [];
		var users = [];

		for ( var key in approveuserlist) {
		    users.push(approveuserlist[key]);
		}
		if (users) {
		    var filterUsers = [];
		    var cmd_line = $("#cmd").val();
		    if (!cmd_line.match(/^approveuser\s+$/)) {
			var username = cmd_line.substr(cmd_line
				.match(/^approveuser\s+/)[0].length,
				cmd_line.length);
			var matcher = syl.util.single_match(username);
			var re = new RegExp(matcher);
			$.each(users, function(i, n) {
			    if (n.n.match(re)) {
				filterUsers.push(n);
			    }
			});
		    } else {
			filterUsers = users;
		    }
		}

		$.each(filterUsers, function(i, n) {
		    result.push({
			label : 'approveuser ' + filterUsers[i].n + ' ('
				+ filterUsers[i].gn + ')',
			userid : filterUsers[i].i,
			groupid : filterUsers[i].gi,
			value : ' '
		    });
		});

		response(result);
	    },

	    search : function(event, ui) {
		var cmd_line = $("#cmd").val();
		if (!cmd_line.match(/^approveuser\s+\S*$/)) {
		    $("#cmd").autocomplete(cmd_obj);
		}
	    },
	    select : function(event, ui) {
		$(this).autocomplete('option', 'userid', ui.item.userid);
		$(this).autocomplete('option', 'groupid', ui.item.groupid);
		$("#cmd").val(ui.item.label + ' ');

		return false;
	    }
	};

	$("#cmd").autocomplete(cmd_obj).keydown(function(event) {
	    if (event.keyCode === $.ui.keyCode.TAB) {
		event.preventDefault();
	    }
	}).keypress(
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
				    var groupid = $('#cmd').autocomplete(
					    "instance").options.groupid;
				    cmd_line = 'apply_group ' + groupid;
				}

				if (cmd_line.match(/approveuser\s+/)) {
				    var groupid = $('#cmd').autocomplete(
					    "instance").options.groupid;
				    var userid = $('#cmd').autocomplete(
					    "instance").options.userid;
				    cmd_line = 'approve_user ' + groupid + ' '
					    + userid;
				}

				$('#cmd').attr('readonly', 'readonly');
				cmd.cmd_line = cmd_line;
				syl.util.ajax_send({
				    cmd : cmd_line
				}, cmd.app + '/' + cmd.label, function(data) {
				    cmd.response(data);
				    if ($('#cmd')) {
					$('#cmd').removeAttr('readonly');
				    }
				});
			    }
			}
		    }
		}).keyup(function(event) {
	    if (event.keyCode === 27) {
		syl.util.showMsg();
		$('#mask').removeClass('dp').addClass('ndp').empty();
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
});
