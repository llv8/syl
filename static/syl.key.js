$(function() {
    syl.key = {
	init : function() {
	    this.__focus_handler();
	    $.each(this.key_cnf(), function(i, n) {
		Mousetrap.bind(n.key, n.req);
	    });
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
		'key' : [ 'alt+1', 'alt+2', 'alt+3', 'alt+4' ],
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
	__focus_handler : function() {
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
	command : function(event) {

	},
	esc : function(event) {
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
	switchwnd : function() {
	    event.preventDefault();
	    var index = 0;
	    for (var i = 0; i < syl.wnd.list.length; i++) {
		if ($(syl.wnd.activewnd).is($(syl.wnd.list[i]))) {
		    index = i + 1;
		    if (index == 4)
			index = 0;
		    break;
		}
	    }
	    $(syl.wnd.list[index])[0].focus();
	},

	scroll_d : function() {
	    $(syl.wnd.activeele).scroll(function(event) {
		this.scrollTop = this.scrollTop + 10;
		$(this).unbind('scroll');

	    });
	    $(syl.wnd.activeele).scroll();
	},

	scroll_u : function() {
	    $(syl.wnd.activeele).scroll(function(event) {
		this.scrollTop = this.scrollTop - 10;
		$(this).unbind('scroll');

	    });
	    $(syl.wnd.activeele).scroll();
	},

	scroll_l : function() {
	    $(syl.wnd.activeele).scroll(function(event) {
		this.scrollLeft = this.scrollLeft - 10;
		$(this).unbind('scroll');

	    });
	    $(syl.wnd.activeele).scroll();
	},

	scroll_r : function() {
	    $(syl.wnd.activeele).scroll(function(event) {
		this.scrollLeft = this.scrollLeft + 10;
		$(this).unbind('scroll');

	    });
	    $(syl.wnd.activeele).scroll();
	},

	__move : function(direct, type) {
	    var index = 0
	    for (var i = 0; i < syl.wnd.list.length; i++) {
		if ($(syl.wnd.list[i])
			.is(
				syl.wnd.activeele.attr('class') == 'wnd' ? syl.wnd.activeele
					: syl.wnd.activeele.parents('.wnd'))) {
		    index = i + 1;
		    break;
		}
	    }

	    // width:direct==1,height:direct==2
	    if (direct == 2) {
		// same row add or reduce
		var height0 = $(syl.wnd.list[0]).css('height');

		// type==1:move to down, type==2:move to up
		if (type == 1) {
		    height0 = parseInt(height0.replace(/px/, '')) + 10;
		} else {
		    height0 = parseInt(height0.replace(/px/, '')) - 10;
		}

		percenttop = height0
			/ (document.documentElement.clientHeight - 20 - 8)
			* 100;

		if (percenttop > 80 || percenttop < 20) {
		    // do nothing
		} else {
		    if (type == 1) {
			$(syl.wnd.list[0]).css(
				'height',
				'\-webkit\-calc(' + Math.ceil(percenttop)
					+ '% - 4px)');
			$(syl.wnd.list[1]).css(
				'height',
				'\-webkit\-calc(' + Math.ceil(percenttop)
					+ '% - 4px)');
			$(syl.wnd.list[2]).css(
				'height',
				'\-webkit\-calc('
					+ (100 - Math.ceil(percenttop))
					+ '% - 4px)');
			$(syl.wnd.list[3]).css(
				'height',
				'\-webkit\-calc('
					+ (100 - Math.ceil(percenttop))
					+ '% - 4px)');
		    } else {
			$(syl.wnd.list[0]).css(
				'height',
				'\-webkit\-calc(' + Math.floor(percenttop)
					+ '% - 4px)');
			$(syl.wnd.list[1]).css(
				'height',
				'\-webkit\-calc(' + Math.floor(percenttop)
					+ '% - 4px)');
			$(syl.wnd.list[2]).css(
				'height',
				'\-webkit\-calc('
					+ (100 - Math.floor(percenttop))
					+ '% - 4px)');
			$(syl.wnd.list[3]).css(
				'height',
				'\-webkit\-calc('
					+ (100 - Math.floor(percenttop))
					+ '% - 4px)');
		    }
		}

	    }

	    if (direct == 1) {
		// same column add or reduce
		var width0 = $(syl.wnd.list[0]).css('width');
		// type==1:move to left, type==2:move to right
		if (type == 1) {
		    width0 = parseInt(width0.replace(/px/, '')) - 10;
		} else {
		    width0 = parseInt(width0.replace(/px/, '')) + 10;
		}

		percentleft = width0
			/ (document.documentElement.clientWidth - 8) * 100;
		if (percentleft > 80 || percentleft < 20) {
		    // do nothing
		} else {
		    if (type == 2) {
			$(syl.wnd.list[0]).css(
				'width',
				'\-webkit\-calc(' + Math.ceil(percentleft)
					+ '% - 4px)');
			$(syl.wnd.list[2]).css(
				'width',
				'\-webkit\-calc(' + Math.ceil(percentleft)
					+ '% - 4px)');
			$(syl.wnd.list[1]).css(
				'width',
				'\-webkit\-calc('
					+ (100 - Math.ceil(percentleft))
					+ '% - 4px)');
			$(syl.wnd.list[3]).css(
				'width',
				'\-webkit\-calc('
					+ (100 - Math.ceil(percentleft))
					+ '% - 4px)');
		    } else {
			$(syl.wnd.list[0]).css(
				'width',
				'\-webkit\-calc(' + Math.floor(percentleft)
					+ '% - 4px)');
			$(syl.wnd.list[2]).css(
				'width',
				'\-webkit\-calc(' + Math.floor(percentleft)
					+ '% - 4px)');
			$(syl.wnd.list[1]).css(
				'width',
				'\-webkit\-calc('
					+ (100 - Math.floor(percentleft))
					+ '% - 4px)');
			$(syl.wnd.list[3]).css(
				'width',
				'\-webkit\-calc('
					+ (100 - Math.floor(percentleft))
					+ '% - 4px)');
		    }

		}
	    }

	},

	move_d : function() {
	    key_handler.__move(2, 1);
	},

	move_u : function() {
	    key_handler.__move(2, 2);
	},

	move_l : function() {
	    key_handler.__move(1, 1);
	},

	move_r : function() {
	    key_handler.__move(1, 2);
	},

	find : function() {
	    $('#dyna')
		    .append(
			    $('<input>')
				    .css({
					'position' : 'absolute',
					'z-index' : '1',
					'left' : '-webkit-calc(50% - 125px)',
					'height' : '20px',
					'width' : '250px',
					'top' : '-webkit-calc(100% - 20px)'
				    })
				    .keyup(
					    function(event) {
						$(syl.wnd.list)
							.removeHighlight();
						syl.wnd.activeselected = 0;

						if (event.keyCode === 27) {
						    $('#dyna').empty();
						}
						if (event.keyCode === 13) {
						    $('#dyna').empty();
						}

						$(syl.wnd.activeele)
							.highlight(
								$(this)
									.val()
									.substring(
										1,
										$(
											this)
											.val().length));
						if ($('.highlight')[0]) {
						    var parent = $(
							    $('.highlight')[0])
							    .parents()
							    .filter(
								    'div[tabIndex]')[0];
						    var top = $('.highlight')[0].offsetTop
							    - parent.offsetTop
							    - 18;
						    $(parent).scrollTop(top);
						    if (event.keyCode === 13) {
							$($('.highlight')[0])
								.css(
									'background-color',
									'#FFC107');

						    }
						}

					    }));

	    $('#dyna input')[0].focus();
	},

	help : function() {
	    var help = $("<div>").css({
		'margin' : '50px auto',
		'width' : '80%'
	    });
	    $('#mask').empty().css('display', 'block').append(help);
	    $.each(syl.key_cnf, function(i, n) {
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
	    syl.wnd.list[Number.parseInt(combo.replace('alt+', '')) - 1]
		    .focus();
	},
	move_n : function() {
	    var hl = $('.highlight');
	    var cur = syl.wnd.activeselected;
	    var next = (cur + 1) == hl.length ? 0 : cur + 1;
	    syl.wnd.activeselected = next;
	    $(hl[cur]).css('background-color', '');
	    $(hl[next]).css('background-color', '#FFC107');
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
	    var cur = syl.wnd.activeselected;
	    var pre = (cur - 1) < 0 ? hl.length - 1 : cur - 1;
	    syl.wnd.activeselected = pre;
	    $(hl[cur]).css('background-color', '');
	    $(hl[pre]).css('background-color', '#FFC107');
	    // viewport
	    // var viewportH = $('#chat_content')[0].clientHeight;
	    // real view
	    // var realH = $('#chat_content')[0].scrollHeight;
	    var parent = $(hl[next]).parents().filter('div[tabIndex]')[0];
	    var top = hl[pre].offsetTop - parent.offsetTop - 18;
	    $(parent).scrollTop(top);
	},

	f_line : function() {
	    syl.wnd.activeele.scrollTop(0);
	},

	l_line : function() {
	    syl.wnd.activeele.scrollTop(syl.wnd.activeele[0].scrollHeight);
	},

	active_el : function() {
	    $('#fkey').empty();

	    var interativeEle = $('a,input,div[tabIndex]');
	    for (var i = 0; i < interativeEle.length; i++) {
		if ($(interativeEle[i]).parents('.wnd').css('display') == 'none') {
		    continue;
		}
		if (interativeEle[i].tagName.toUpperCase() == 'DIV'
			&& $(interativeEle[i]).attr('class') == 'wnd'
			|| ($(interativeEle[i]).attr('class') && $(
				interativeEle[i]).attr('class').indexOf(
				'ui-menu-item') >= 0)) {
		    continue;
		}

		var tip = $('<div>').attr('class', 'fkey').html(i);
		var position = $(interativeEle[i]).position();
		var top = position.top - tip.css('height').replace(/px/, '');
		var left = position.left - tip.css('width').replace(/px/, '');
		tip.css('top', top);
		tip.css('left', left);
		tip.css('z-index', $(interativeEle[i]).parents('.wnd').css(
			'z-index'));
		$('#fkey').append(tip).css('display', 'block');

		(function(ind) {
		    Mousetrap
			    .bind((ind + '').split('').join(' '),
				    function(event) {
					if (interativeEle[ind].tagName
						.toUpperCase() == 'A') {
					    var url = $(interativeEle[ind])
						    .attr('href');
					    window.open(url);
					} else if (interativeEle[ind].tagName
						.toUpperCase() == 'INPUT') {
					    $(interativeEle[ind]).focus();
					    event.preventDefault();
					} else if (interativeEle[ind].tagName
						.toUpperCase() == 'DIV') {
					    $(interativeEle[ind]).focus();
					    event.preventDefault();
					}

					$('#fkey').css('display', 'none')
						.empty();
				    });
		})(i);
	    }
	},
	chat_send : function(event) {
	    if (event.keyCode == 64 && $('#chat_content').val() == '') {

		var userList = JSON.parse(localStorage.getItem('ul'));

	    } else if (event.keyCode == 64 && $('#chat_content').val() == '@') {

	    } else if (event.keyCode == 13) {
		if (syl.touser) {
		    if (!$(syl.wnd.activeele).is($('#chat_textarea')))
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
			    'msg' : content
			};
			syl.ws.send(msg);
		    }
		}
	    }

	},

	open_popup : function() {
	    $('#popup').css('display', 'block');
	    var popup = $('#popup')[0];
	    popup.style.top = document.body.scrollTop
		    + document.body.clientHeight - popup.clientHeight - 4 - 20
		    + "px";
	    popup.style.left = document.body.scrollLeft
		    + document.body.clientWidth - popup.clientWidth - 4 + "px";
	},

	close_popup : function() {
	    $('#popup').css('display', 'none');
	},

	max_or_min_wnd : function() {
	    if (syl.wnd.activewnd.css('position') == 'relative') {
		syl.wnd.activewnd.css('position', '');
		for (var i = 0; i < syl.wnd.list.length; i++) {
		    $(syl.wnd.list[i]).css('display', 'block');
		    $(syl.wnd.list[i]).css('width',
			    $(syl.wnd.list[i]).attr('pre-width'));
		    $(syl.wnd.list[i]).css('height',
			    $(syl.wnd.list[i]).attr('pre-height'));

		    $(syl.wnd.list[i]).removeAttr('pre-width');
		    $(syl.wnd.list[i]).removeAttr('pre-height');
		}
		syl.wnd.list.css({
		    'float' : 'left'
		});
	    } else {
		var width = $(syl.wnd.list[0]).css('width');
		var all_width = document.documentElement.clientWidth;
		var percent_width = parseInt(width.replace(/px/, ''))
			/ (all_width - 8) * 100;

		var height = $(syl.wnd.list[0]).css('height');
		var all_height = document.documentElement.clientHeight;
		var percent_height = parseInt(height.replace(/px/, ''))
			/ (all_height - 20 - 8) * 100;

		$(syl.wnd.list[0]).attr(
			'pre-height',
			'\-webkit\-calc(' + Math.ceil(percent_height)
				+ '% - 4px)');
		$(syl.wnd.list[0]).attr(
			'pre-width',
			'\-webkit\-calc(' + Math.ceil(percent_width)
				+ '% - 4px)');
		$(syl.wnd.list[1]).attr(
			'pre-height',
			'\-webkit\-calc(' + Math.ceil(percent_height)
				+ '% - 4px)');
		$(syl.wnd.list[1]).attr(
			'pre-width',
			'\-webkit\-calc(' + (100 - Math.ceil(percent_width))
				+ '% - 4px)');
		$(syl.wnd.list[2]).attr(
			'pre-height',
			'\-webkit\-calc(' + (100 - Math.ceil(percent_height))
				+ '% - 4px)');
		$(syl.wnd.list[2]).attr(
			'pre-width',
			'\-webkit\-calc(' + Math.ceil(percent_width)
				+ '% - 4px)');
		$(syl.wnd.list[3]).attr(
			'pre-height',
			'\-webkit\-calc(' + (100 - Math.ceil(percent_height))
				+ '% - 4px)');
		$(syl.wnd.list[3]).attr(
			'pre-width',
			'\-webkit\-calc(' + (100 - Math.ceil(percent_width))
				+ '% - 4px)');

		$(syl.wnd.list).css('display', 'none');

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
    }
});
