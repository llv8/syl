$(function() {

    syl = {
	user : {
	    name : 111,
	    staus : 222,
	    loc : 333,
	},
	wnd : {
	    list : null,
	    activewnd : null,
	    activeele : null
	},
	init : function() {
	    // this.login();
	    // this.loadFile();
	    this.registerKey();
	    this.registerFocus();
	    Mousetrap.bind('esc', this.escHandler);
	    $('input,textarea').keyup(this.escHandler);

	},
	registerFocus : function() {
	    syl.wnd.list = $('.wnd');
	    $('input,textarea, div[tabIndex]').focus(
		    function() {
			$('input,textarea,div[tabIndex]').css('border-color',
				'#a1a1a1');
			for (var i = 0; i < syl.wnd.list.length; i++) {
			    $(syl.wnd.list[i]).children('.title').css(
				    'opacity', '0.5');
			}
			if ($(this).attr('class') == 'wnd') {
			    $(this).children('.title').css('opacity', '1');
			    syl.wnd.activewnd = $(this);
			} else {
			    $(this).parents('.wnd').children('.title').css(
				    'opacity', '1');
			    syl.wnd.activewnd = $(this).parents('.wnd');
			}
			$(this).css('border-color', 'red');
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
		'req' : function() {
		},
		'help' : 'find'
	    },
	    'alt+s' : {
		'req' : function() {

		},
		'help' : 'switch style'
	    },
	    'H' : {
		'req' : function() {
		},
		'help' : 'extend window left'
	    },
	    'L' : {
		'req' : function() {
		},
		'help' : 'extend window right'
	    },
	    'J' : {
		'req' : function() {
		},
		'help' : 'extend window down'
	    },
	    'K' : {
		'req' : function() {
		},
		'help' : 'extend window up'
	    },
	    'h' : {
		'req' : function() {
		},
		'help' : 'scroll window left'
	    },
	    'l' : {
		'req' : function() {
		},
		'help' : 'scroll window right'
	    },
	    'j' : {
		'req' : function() {
		},
		'help' : 'scroll window down'
	    },
	    'k' : {
		'req' : function() {
		},
		'help' : 'scroll window up'
	    },
	    'alt+f' : {
		'req' : syl_command,
		help : 'command'
	    },
	    'alt+1' : {
		'req' : function() {
		    syl.wnd.list[0].focus();
		},
		'help' : 'active window 1'
	    },
	    'alt+2' : {
		'req' : function() {
		    syl.wnd.list[1].focus();

		},
		'help' : 'active window 2'
	    },
	    'alt+3' : {
		'req' : function() {
		    syl.wnd.list[2].focus();

		},
		'help' : 'active window 3'
	    },
	    'alt+4' : {
		'req' : function() {
		    syl.wnd.list[3].focus();
		},
		'help' : 'active window 4'
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
	    if ($('#mask').css('display') == 'block') {
		$('#mask').css('display', 'none').empty();
	    } else if ($('#fkey').css('display') == 'block') {
		$('#fkey').css('display', 'none').empty();
		console.log($('#fkey').css('display'));
		console.log($('#fkey').html());
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

function CmdRequest(cmd) {
    this.cmd = cmd;
    function send() {
	$.ajax({
	    type : 'POST',
	    url : this.cmd.app + '/' + this.cmd.label,
	    data : 'cmd=' + cmd.cmd_line,
	    success : function(data) {
		this.cmd.response(data);
	    }
	})
    }
}

function syl_activeElement() {
    $('#fkey').empty();
    var interativeEle = $('a,input,textarea,div[tabIndex]');
    for (var i = 0; i < interativeEle.length; i++) {
	if (interativeEle[i].tagName.toUpperCase() == 'DIV'
		&& $(interativeEle[i]).attr('class') == 'wnd') {
	    continue;
	}
	var tip = $('<div>').attr('class', 'fkey').html(i);
	var position = $(interativeEle[i]).position();
	var top = position.top - tip.css('height').replace(/px/, '');
	var left = position.left - tip.css('width').replace(/px/, '');
	tip.css('top', top);
	tip.css('left', left);
	$('#fkey').append(tip).css('display', 'block');

	(function(ind) {
	    Mousetrap
		    .bind(
			    (ind + '').split('').join(' '),
			    function(event) {
				if (interativeEle[ind].tagName.toUpperCase() == 'A') {
				    var url = $(interativeEle[ind])
					    .attr('href');
				    window.open(url);
				} else if (interativeEle[ind].tagName
					.toUpperCase() == 'INPUT'
					|| interativeEle[ind].tagName
						.toUpperCase() == 'TEXTAREA') {
				    $(interativeEle[ind]).focus();
				    event.preventDefault();
				} else if (interativeEle[ind].tagName
					.toUpperCase() == 'DIV') {
				    $(interativeEle[ind]).focus();
				}

				$('#fkey').css('display', 'none').empty();
			    });
	})(i);
    }
}

function syl_maxOrMinWnd() {
    if (syl.wnd.activewnd.css('position') == 'relative') {
	syl.wnd.activewnd.css('position', '');
	for (var i = 0; i < syl.wnd.list.length; i++) {
	    $(syl.wnd.list[i]).css('display', 'block');
	}
	syl.wnd.activewnd.css({
	    'float' : 'left',
	    'width' : '-webkit-calc(50% - 4px)',
	    'height' : '-webkit-calc(50% - 4px)'
	});
    } else {
	for (var i = 0; i < syl.wnd.list.length; i++) {
	    $(syl.wnd.list[i]).css('display', 'none');
	}
	syl.wnd.activewnd.css('display', 'block').css({
	    'z-index' : 499,
	    'top' : 0,
	    'left' : 0,
	    'position' : 'relative',
	    'width' : '-webkit-calc(100% - 4px)',
	    'height' : '-webkit-calc(100% - 4px)',
	});
    }
}

function syl_command(event) {

    event.preventDefault();
    var CMD_CNF = [
	    {
		label : 'adduser',
		app : 'cust',
		value : 'Li,Lei M 18848884888 lilei.gmail.com',
		help : 'params--1:lastname,firstname 2:gender M-Male F-Female 3:phone 4:email',
		valid : function(cmd_line) {
		    var params = cmd_line.split(/\s+/);
		    var err_msg = '';
		    if (params.length != 5) {
			err_msg = 'miss parameter!'

		    }
		},
		response : function(data) {

		}
	    }, {
		label : 'addgroup',
		app : 'cust',
		value : 'groupname',
		help : 'params--1:groupname'
	    }

    ];
    var input = $('<input>').attr('id', 'cmd');
    $('#mask').append(input).css('display', 'block');
    input[0].focus();

    $("#cmd").autocomplete({
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
	    $("#cmd").val(ui.item.label);
	    syl.showMsg(ui.item.help, 1);
	    return false;
	}
    }).autocomplete("instance")._renderItem = function(ul, item) {
	var tip = $("<span>").html(item.value).css("color", "#B8B8B8");

	var tip_html = $("<div>").append(tip).html();
	var content = "<a>" + item.label + " " + tip_html + "</a>";

	return $("<li>").append(content).appendTo(ul);
    };
    $("#cmd").keypress(function(event) {
	if (event.keyCode === 13) {
	    var cmd_line = $("#cmd").val();
	    var cmd = null;
	    $.each(CMD_CNF, function(i, n) {
		if (cmd_line.match('^' + n.label + ' ')) {
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
		    cmd.cmd_line = cmd_line;
		    new CmdRequest(cmd).send();
		}
	    }
	}
    });
    $("#cmd").keyup(function(event) {
	if (event.keyCode === 27) {
	    syl.showMsg();
	    $('#mask').css('display', 'none').empty();
	}
    });

}

function syl_help() {
    var help = $("<div>").attr('class', 'center');
    $('#mask').empty().css('display', 'block').append(help);

    for (key in syl.key_cnf) {
	if (syl.key_cnf.hasOwnProperty(key)) {
	    var jkey = $('<span>').html(key + ":").css('font-weight', 'bold')
		    .css('padding', '10px');
	    var jvalue = $('<span>').html(syl.key_cnf[key]['help']);
	    var jdiv = $('<div>').css('padding', '5px').append(jkey).append(
		    jvalue);
	    help.append(jdiv);
	}
    }

    var width = help.css('width').replace('px', '');

    help.css('width', width + 'px').css('display', 'block').css('margin-left',
	    (width / 2 - width) + 'px');
}
