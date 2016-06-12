$(function() {
    syl.key = {
	init : function() {
	    $.each(this.key_cnf(), function(i, n) {
		Mousetrap.bind(n.key, n.req);
	    });
	    syl.key.__focus_handler();
	},
	key_cnf : function() {
	    var th = this
	    return [ {
		'key' : 'esc',
		'req' : th.esc,
		'help' : 'quit'
	    }, {
		'key' : 'f',
		'req' : th.active_el,
		'help' : 'active element'
	    },

	    {
		'key' : 'm',
		'req' : th.max_or_min_wnd,
		'help' : 'maximized window or restore window'
	    }, {
		'key' : '/',
		'req' : th.find,
		'help' : 'find'
	    }, {
		'key' : 'alt+s',
		'req' : th.switchwnd,
		'help' : 'switch window'
	    }, {
		'key' : 'H',
		'req' : th.move_l,
		'help' : 'extend window left'
	    }, {
		'key' : 'L',
		'req' : th.move_r,
		'help' : 'extend window right'
	    }, {
		'key' : 'p',
		'req' : th.open_popup,
		'help' : 'open popup'
	    }, {
		'key' : 'x',
		'req' : th.close_popup,
		'help' : 'close popup'
	    },

	    {
		'key' : 'n',
		'req' : th.move_n,
		'help' : 'move to next selected'
	    }, {
		'key' : 'N',
		'req' : th.move_p,
		'help' : 'move to previous selected'
	    },

	    {
		'key' : 'J',
		'req' : th.move_d,
		'help' : 'extend window down'
	    }, {
		'key' : 'K',
		'req' : th.move_u,
		'help' : 'extend window up'
	    }, {
		'key' : 'h',
		'req' : th.scroll_l,
		'help' : 'scroll window left'
	    }, {
		'key' : 'l',
		'req' : th.scroll_r,
		'help' : 'scroll window right'
	    }, {
		'key' : 'j',
		'req' : th.scroll_d,
		'help' : 'scroll window down'
	    }, {
		'key' : 'k',
		'req' : th.scroll_u,
		'help' : 'scroll window up'
	    }, {
		'key' : 'g g',
		'req' : th.f_line,
		'help' : 'first line'
	    }, {
		'key' : 'G',
		'req' : th.l_line,
		'help' : 'last line'
	    }, {
		'key' : 'alt+f',
		'req' : th.command,
		'help' : 'command'
	    }, {
		'key' : [ 'alt+1', 'alt+2', 'alt+3', 'alt+4', 'alt+5' ],
		'req' : th.active_wnd,
		'help' : 'active window',
		'desc' : 'alt+num'
	    },

	    {
		'key' : 'alt+enter',
		'req' : th.chat_send,
		'help' : 'submit chat message'
	    }, {
		'key' : '?',
		'req' : th.help,
		'help' : 'help'
	    } ]
	},
	__all_el : function() {
	    return $('a,input,textarea,div[tabIndex]');
	},
	__focus_handler : function() {
	    var all_el = syl.key.__all_el();
	    all_el.focus(function() {
		all_el.filter('input,textarea,div[tabIndex]')
			.removeClass('a_b').addClass('i_b');
		$('.title').removeClass('a_t').addClass('i_t');
		if (this.tagName != 'A') {
		    $(this).removeClass('i_b').addClass('a_b');
		}

		$(this).parents('.wnd').children('.title').removeClass('i_t')
			.addClass('a_t');
		$(this).children('.title').removeClass('i_t').addClass('a_t');
	    });
	    all_el.blur(function() {
		if (document.activeElement.tagName == 'BODY') {
		    syl.pre_focus = this;
		}
		syl.blur_obj = this;
	    });
	    $('.main')[0].focus();
	},
	esc : function(event) {
	    event.preventDefault();
	    if ($('.highlight').length > 0) {
		$('.wnd').removeHighlight();
	    } else if ($('#mask').hasClass('dp')) {
		$('#mask').removeClass('dp').addClass('ndp').empty();
	    } else if ($('#fkey').hasClass('dp')) {
		$('#fkey').removeClass('dp').addClass('ndp').empty();
	    }
	    var cur_el = null;
	    if (document.activeElement.tagName == 'BODY') {
		cur_el = syl.blur_obj;
	    } else {
		cur_el = document.activeElement;
	    }
	    var parents = $(cur_el).parents();
	    for (var i = 0; i < parents.length; i++) {
		if ($(parents[i]).attr('tabIndex')) {
		    $(parents[i]).focus();
		    break;
		}
	    }
	},
	__cur_wnd : function() {
	    var cur_wnd = null;
	    if (document.activeElement.tagName == 'BODY') {
		return $(syl.pre_focus);
	    }
	    if ($(document.activeElement).hasClass('wnd')) {
		cur_wnd = $(document.activeElement);
	    } else {
		cur_wnd = $(document.activeElement).parents('.wnd');
	    }
	    return cur_wnd;
	},
	switchwnd : function() {
	    event.preventDefault();
	    var index = 0;
	    var list = $('.wnd').filter('.dp');
	    var cur_wnd = syl.key.__cur_wnd();
	    for (var i = 0; i < $('.wnd').length; i++) {
		if (cur_wnd.is($(list[i]))) {
		    index = i + 1;
		    if (index == list.length)
			index = 0;
		    break;
		}
	    }
	    $(list[index]).focus();
	},

	scroll_d : function() {
	    $(document.activeElement).scroll(function(event) {
		this.scrollTop = this.scrollTop + 20;
		$(this).unbind('scroll');

	    });
	    $(document.activeElement).scroll();
	},

	scroll_u : function() {
	    $(document.activeElement).scroll(function(event) {
		this.scrollTop = this.scrollTop - 20;
		$(this).unbind('scroll');

	    });
	    $(document.activeElement).scroll();
	},

	scroll_l : function() {
	    $(document.activeElement).scroll(function(event) {
		this.scrollLeft = this.scrollLeft - 20;
		$(this).unbind('scroll');

	    });
	    $(document.activeElement).scroll();
	},

	scroll_r : function() {
	    $(document.activeElement).scroll(function(event) {
		this.scrollLeft = this.scrollLeft + 20;
		$(this).unbind('scroll');

	    });
	    $(document.activeElement).scroll();
	},
	__pos : function(index, css, val) {
	    $($('.main')[index]).css(css, '\-webkit\-calc(' + val + '% - 4px)');
	},
	__move : function(direct, type) {
	    var index = 0;
	    var list = $('.main');
	    var cur_wnd = syl.key.__cur_wnd();
	    for (var i = 0; i < list.length; i++) {
		if ($(list[i]).is(cur_wnd)) {
		    index = i + 1;
		    break;
		}
	    }
	    // width:direct==1,height:direct==2
	    if (direct == 2) {
		// same row add or reduce
		var height0 = $(list[0]).css('height');

		// type==1:move to down, type==2:move to up
		if (type == 1) {
		    height0 = parseInt(height0.replace(/px/, '')) + 10;
		} else {
		    height0 = parseInt(height0.replace(/px/, '')) - 10;
		}

		percenttop = height0
			/ (document.documentElement.clientHeight - 20 - 8)
			* 100;

		if (percenttop > 80 && type == 1) {
		    // do nothing
		} else if (percenttop < 20 && type == 2) {
		    // do nothing
		} else {
		    if (type == 1) {
			syl.key.__pos(0, 'height', Math.ceil(percenttop));
			syl.key.__pos(1, 'height', Math.ceil(percenttop));
			syl.key.__pos(2, 'height', 100 - Math.ceil(percenttop));
			syl.key.__pos(3, 'height', 100 - Math.ceil(percenttop));

		    } else {
			syl.key.__pos(0, 'height', Math.floor(percenttop));
			syl.key.__pos(1, 'height', Math.floor(percenttop));
			syl.key
				.__pos(2, 'height', 100 - Math
					.floor(percenttop));
			syl.key
				.__pos(3, 'height', 100 - Math
					.floor(percenttop));
		    }
		}

	    }

	    if (direct == 1) {
		// same column add or reduce
		var width0 = $(list[0]).css('width');
		// type==1:move to left, type==2:move to right
		if (type == 1) {
		    width0 = parseInt(width0.replace(/px/, '')) - 10;
		} else {
		    width0 = parseInt(width0.replace(/px/, '')) + 10;
		}

		percentleft = width0
			/ (document.documentElement.clientWidth - 8) * 100;

		if (percentleft > 80 && type == 2) {
		    // do nothing
		} else if (percentleft < 20 && type == 1) {
		    // do nothing
		} else {
		    if (type == 2) {
			syl.key.__pos(0, 'width', Math.ceil(percentleft));
			syl.key.__pos(1, 'width', 100 - Math.ceil(percentleft));
			syl.key.__pos(2, 'width', Math.ceil(percentleft));
			syl.key.__pos(3, 'width', 100 - Math.ceil(percentleft));
		    } else {
			syl.key.__pos(0, 'width', Math.floor(percentleft));
			syl.key
				.__pos(1, 'width', 100 - Math
					.floor(percentleft));
			syl.key.__pos(2, 'width', Math.floor(percentleft));
			syl.key
				.__pos(3, 'width', 100 - Math
					.floor(percentleft));
		    }
		}
	    }

	},

	move_d : function() {
	    syl.key.__move(2, 1);
	},

	move_u : function() {
	    syl.key.__move(2, 2);
	},

	move_l : function() {
	    syl.key.__move(1, 1);
	},

	move_r : function() {
	    syl.key.__move(1, 2);
	},

	find : function() {
	    var find = $('<input class="find">');
	    find.keyup(function(event) {
		$('.wnd').removeHighlight();
		syl.find_index = 0;
		if (event.keyCode === 27) {
		    $('#dyna').empty();
		}
		if (event.keyCode === 13) {
		    $('#dyna').empty();
		}

		$(document.activeElement).highlight(
			$(this).val().substring(1, $(this).val().length));
		if ($('.highlight')[0]) {
		    var parent = $($('.highlight')[0]).parents().filter(
			    'div[tabIndex]')[0];
		    var top = $('.highlight')[0].offsetTop - parent.offsetTop
			    - 18;
		    $(parent).scrollTop(top);
		    if (event.keyCode === 13) {
			$($('.highlight')[0]).addClass('a_highlight_bg');

			// TODO:<a>标签的回车事件
			$('.highlight').keypress(
				function(event) {
				    if (event.keyCode === 13
					    && $(this).hasClass(
						    'a_highlight_bg')
					    && $(this).parent('a').length > 0) {
					// TODO:

				    }
				});
		    }
		}
	    });
	    $('#dyna').append(find);
	    $('#dyna input')[0].focus();
	},

	move_n : function() {
	    var hl = $('.highlight');
	    var cur = syl.find_index;
	    var next = (cur + 1) == (hl.length - 1) ? 0 : cur + 1;
	    syl.find_index = next;
	    $(hl[cur]).removeClass('a_highlight_bg');
	    $(hl[next]).addClass('a_highlight_bg');
	    // viewport
	    // var viewportH = $('#chat_content')[0].clientHeight;
	    // real view
	    // var realH = $('#chat_content')[0].scrollHeight;
	    var parent = $(hl[next]).parents().filter('div[tabIndex]')[0];
	    var top = hl[next].offsetTop - parent.offsetTop - 18;
	    $(parent).scrollTop(top);
	},

	move_p : function() {
	    var hl = $('.highlight');
	    var cur = syl.find_index;
	    var pre = (cur - 1) < 0 ? hl.length - 2 : cur - 1;
	    syl.find_index = pre;
	    $(hl[cur]).removeClass('a_highlight_bg');
	    $(hl[pre]).addClass('a_highlight_bg');
	    // viewport
	    // var viewportH = $('#chat_content')[0].clientHeight;
	    // real view
	    // var realH = $('#chat_content')[0].scrollHeight;
	    var parent = $(hl[pre]).parents().filter('div[tabIndex]')[0];
	    var top = hl[pre].offsetTop - parent.offsetTop - 18;
	    $(parent).scrollTop(top);
	},

	help : function() {
	    var help = $("<div class='help'>");
	    $('#mask').empty().removeClass('ndp').addClass('dp').append(help);
	    $.each(syl.key.key_cnf(), function(i, n) {
		var jkey = $('<span>').html(n.desc ? n.desc : n.key + ":").css(
			'font-weight', 'bold').css('padding', '10px');
		var jvalue = $('<span>').html(n.help);
		var jdiv = $('<div>').css({
		    'width' : '50%',
		    'margin' : '10px 0',
		    'float' : 'left'
		}).append(jkey).append(jvalue);
		help.append(jdiv);
	    });

	},
	active_wnd : function(e, combo) {
	    event.preventDefault();
	    $('.wnd')[Number.parseInt(combo.replace('alt+', '')) - 1].focus();
	},

	f_line : function() {
	    $(document.activeElement).scrollTop(0);
	},

	l_line : function() {
	    $(document.activeElement).scrollTop(
		    document.activeElement.scrollHeight);
	},

	__get_tip : function(i) {
	    var CHAR = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
		    'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
		    'x', 'y', 'z' ];
	    var first = CHAR[Math.floor(i / 26)];
	    var second = CHAR[i % 26];
	    return first + second;
	},

	active_el : function() {
	    $('#fkey').empty();
	    var els = syl.key.__all_el();
	    for (var i = 0; i < els.length; i++) {
		if ($(els[i]).css('display') == 'none'
			|| $(els[i]).hasClass('wnd')) {
		    continue;
		}
		var tip_content = syl.key.__get_tip(i);
		var tip = $('<div class="fkey">').html(tip_content);
		var position = $(els[i]).position();
		var top = position.top;
		var left = position.left;
		if (top + parseInt($(els[i]).css('height').replace('px', '')) < 0
			|| left
				+ parseInt($(els[i]).css('width').replace('px',
					'')) < 0) {
		    continue;
		}
		var parents = $(els[i]).parents();
		var break_flag = false;
		for (var j = 0; j < parents.length; j++) {
		    if ($(parents[j]).css('display') == 'none') {
			break_flag = true;
			break;
		    }
		    if ($(parents[j]).css('position') == 'relative') {
			var parent_pos = $(parents[j]).position();
			var p_height = parseInt($(parents[j]).css('height')
				.replace('px', ''));
			var p_width = parseInt($(parents[j]).css('width')
				.replace('px', ''));
			if (p_height < top || p_width < left) {
			    break_flag = true;
			    break;
			}
			top += parent_pos.top;
			left += parent_pos.left;
		    }

		}
		if (break_flag) {
		    continue;
		}

		tip.css('top', top);
		tip.css('left', left);

		$('#fkey').append(tip).removeClass('ndp').addClass('dp');

		(function(ind, tip_content) {
		    Mousetrap
			    .bind(
				    tip_content.split('').join(' '),
				    function(event) {
					if (els[ind].tagName.toUpperCase() == 'A') {
					    var url = $(els[ind]).attr('href');
					    if (!url || url.indexOf('#') == 0) {
						$(els[ind]).click();
						$($(els[ind]).attr('href'))
							.focus();
					    } else {
						window.open(url);
					    }
					} else if (els[ind].tagName
						.toUpperCase() == 'INPUT'
						|| els[ind].tagName
							.toUpperCase() == 'DIV'
						|| els[ind].tagName
							.toUpperCase() == 'TEXTAREA') {
					    $(els[ind]).focus();
					    event.preventDefault();
					}

					$('#fkey').removeClass('dp').addClass(
						'ndp').empty();
				    });
		})(i, tip_content);
	    }
	},
	chat_send : function(event) {
	    if (event.keyCode == 64 && $('#chat_content').val() == '') {

		var userList = JSON.parse(localStorage.getItem('ul'));

	    } else if (event.keyCode == 64 && $('#chat_content').val() == '@') {

	    } else if (event.keyCode == 13) {
		if (syl.touser) {
		    if (!$(document.activeElement).is($('#chat_textarea')))
			return;
		    var cmd = 'CHAT';
		    var fromuser = syl.util.get_obj('u');
		    if (fromuser.s != 1 || !fromuser.t)
			return;
		    var from = fromuser.i;
		    var to = syl.touser.i;
		    var tos = [];
		    if (parseInt(to) <= 100000) {
			var ul = syl.util.get_obj('ul');
			for ( var key in ul) {
			    var gus = ul[key]['gus'];
			    if (gus) {
				for ( var gui in gus) {
				    if (gus[gui]['gi'] == parseInt(to)) {
					tos.push(key);
				    }
				}
			    }
			}
		    }
		    $('#chat_bar').html('@' + syl.touser.n);
		    var content = $('#chat_textarea').html();
		    content = content.replace(/@[a-zA-Z0-9,]+:/, '');
		    if (content && to && from) {
			var msg = {
			    'cmd' : cmd,
			    'from' : from,
			    'to' : $.isEmptyObject(tos) ? to : tos,
			    'gid' : $.isEmptyObject(tos) ? null : to,
			    'msg' : encodeURIComponent(content)
			};
			syl.ws.send(msg);
		    }
		}
	    }

	},

	open_popup : function() {
	    $('#popup').removeClass('ndp').addClass('dp');
	    var popup = $('#popup')[0];
	    popup.style.top = document.body.scrollTop - popup.clientHeight - 4
		    + "px";
	    popup.style.left = document.body.scrollLeft
		    + document.body.clientWidth - popup.clientWidth - 4 + "px";
	    syl.pre_popup_activeel = document.activeElement;
	    $('#popup_content').focus();
	},

	close_popup : function() {
	    if ($('#popup .title').hasClass('a_t')) {
		$(syl.pre_popup_activeel).focus();
	    }
	    $('#popup').removeClass('dp').addClass('ndp');

	},
	__pre_pos : function(el, attr, val) {
	    $(el).attr(attr, '\-webkit\-calc(' + val + '% - 4px)');
	},
	max_or_min_wnd : function() {
	    var cur_wnd = syl.key.__cur_wnd();
	    if (cur_wnd.attr('id') == 'popup') {
		if (cur_wnd.attr('pre-width')) {
		    $(cur_wnd).css('width', $(cur_wnd).attr('pre-width'));
		    $(cur_wnd).css('height', $(cur_wnd).attr('pre-height'));
		    $(cur_wnd).css('top', $(cur_wnd).attr('pre-top'));
		    $(cur_wnd).css('left', $(cur_wnd).attr('pre-left'));
		    $(cur_wnd).removeAttr('pre-width');
		    $(cur_wnd).removeAttr('pre-height');
		    $(cur_wnd).removeAttr('pre-top');
		    $(cur_wnd).removeAttr('pre-left');
		} else {
		    $(cur_wnd).attr('pre-width', $(cur_wnd).css('width'));
		    $(cur_wnd).attr('pre-height', $(cur_wnd).css('height'));
		    $(cur_wnd).attr('pre-top', $(cur_wnd).css('top'));
		    $(cur_wnd).attr('pre-left', $(cur_wnd).css('left'));

		    $(cur_wnd).css('width', '\-webkit\-calc(100% - 4px)');
		    $(cur_wnd).css('height', '\-webkit\-calc(100% - 4px)');
		    $(cur_wnd).css('top', 0);
		    $(cur_wnd).css('left', 0);
		}
		return;
	    }
	    if (cur_wnd.hasClass('max')) {
		cur_wnd.removeClass('max');
		var list = $('.main');
		list.removeClass('ndp').addClass('dp');
		for (var i = 0; i < list.length; i++) {
		    $(list[i]).css('width', $(list[i]).attr('pre-width'));
		    $(list[i]).css('height', $(list[i]).attr('pre-height'));
		    $(list[i]).removeAttr('pre-width');
		    $(list[i]).removeAttr('pre-height');
		}
	    } else {
		var list = $('.main');
		var width = $(list[0]).css('width');
		var all_width = document.documentElement.clientWidth;
		var percent_width = parseInt(width.replace(/px/, ''))
			/ (all_width - 8) * 100;

		var height = $(list[0]).css('height');
		var all_height = document.documentElement.clientHeight;
		var percent_height = parseInt(height.replace(/px/, ''))
			/ (all_height - 20 - 8) * 100;
		syl.key.__pre_pos(list[0], 'pre-height', Math
			.ceil(percent_height));
		syl.key.__pre_pos(list[0], 'pre-width', Math
			.ceil(percent_width));
		syl.key.__pre_pos(list[1], 'pre-height', Math
			.ceil(percent_height));
		syl.key.__pre_pos(list[1], 'pre-width', 100 - Math
			.ceil(percent_width));
		syl.key.__pre_pos(list[2], 'pre-height', 100 - Math
			.ceil(percent_height));
		syl.key.__pre_pos(list[2], 'pre-width', Math
			.ceil(percent_width));
		syl.key.__pre_pos(list[3], 'pre-height', 100 - Math
			.ceil(percent_height));
		syl.key.__pre_pos(list[3], 'pre-width', 100 - Math
			.ceil(percent_width));
		list.removeClass('dp').addClass('ndp');
		cur_wnd.addClass('max').removeClass('ndp').addClass('dp');
		cur_wnd.css({
		    'width' : '-webkit-calc(100% - 4px)',
		    'height' : '-webkit-calc(100% - 4px)',
		});
	    }
	}
    }
});
