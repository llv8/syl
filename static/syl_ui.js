function syl_switchwnd() {
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
}

function syl_scrollD() {
    $(syl.wnd.activeele).scroll(function(event) {
	this.scrollTop = this.scrollTop + 10;
	$(this).unbind('scroll');

    });
    $(syl.wnd.activeele).scroll();
}

function syl_scrollU() {
    $(syl.wnd.activeele).scroll(function(event) {
	this.scrollTop = this.scrollTop - 10;
	$(this).unbind('scroll');

    });
    $(syl.wnd.activeele).scroll();
}

function syl_scrollL() {
    $(syl.wnd.activeele).scroll(function(event) {
	this.scrollLeft = this.scrollLeft - 10;
	$(this).unbind('scroll');

    });
    $(syl.wnd.activeele).scroll();
}

function syl_scrollR() {
    $(syl.wnd.activeele).scroll(function(event) {
	this.scrollLeft = this.scrollLeft + 10;
	$(this).unbind('scroll');

    });
    $(syl.wnd.activeele).scroll();
}

function syl_move(direct, type) {
    var index = 0
    for (var i = 0; i < syl.wnd.list.length; i++) {
	if ($(syl.wnd.list[i]).is(
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

	percenttop = height0 / (document.documentElement.clientHeight - 20 - 8)
		* 100;

	if (percenttop > 80 || percenttop < 20) {
	    // do nothing
	} else {
	    if (type == 1) {
		$(syl.wnd.list[0]).css('height',
			'\-webkit\-calc(' + Math.ceil(percenttop) + '% - 4px)');
		$(syl.wnd.list[1]).css('height',
			'\-webkit\-calc(' + Math.ceil(percenttop) + '% - 4px)');
		$(syl.wnd.list[2]).css(
			'height',
			'\-webkit\-calc(' + (100 - Math.ceil(percenttop))
				+ '% - 4px)');
		$(syl.wnd.list[3]).css(
			'height',
			'\-webkit\-calc(' + (100 - Math.ceil(percenttop))
				+ '% - 4px)');
	    } else {
		$(syl.wnd.list[0])
			.css(
				'height',
				'\-webkit\-calc(' + Math.floor(percenttop)
					+ '% - 4px)');
		$(syl.wnd.list[1])
			.css(
				'height',
				'\-webkit\-calc(' + Math.floor(percenttop)
					+ '% - 4px)');
		$(syl.wnd.list[2]).css(
			'height',
			'\-webkit\-calc(' + (100 - Math.floor(percenttop))
				+ '% - 4px)');
		$(syl.wnd.list[3]).css(
			'height',
			'\-webkit\-calc(' + (100 - Math.floor(percenttop))
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

	percentleft = width0 / (document.documentElement.clientWidth - 8) * 100;
	if (percentleft > 80 || percentleft < 20) {
	    // do nothing
	} else {
	    if (type == 2) {
		$(syl.wnd.list[0])
			.css(
				'width',
				'\-webkit\-calc(' + Math.ceil(percentleft)
					+ '% - 4px)');
		$(syl.wnd.list[2])
			.css(
				'width',
				'\-webkit\-calc(' + Math.ceil(percentleft)
					+ '% - 4px)');
		$(syl.wnd.list[1]).css(
			'width',
			'\-webkit\-calc(' + (100 - Math.ceil(percentleft))
				+ '% - 4px)');
		$(syl.wnd.list[3]).css(
			'width',
			'\-webkit\-calc(' + (100 - Math.ceil(percentleft))
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
			'\-webkit\-calc(' + (100 - Math.floor(percentleft))
				+ '% - 4px)');
		$(syl.wnd.list[3]).css(
			'width',
			'\-webkit\-calc(' + (100 - Math.floor(percentleft))
				+ '% - 4px)');
	    }

	}
    }

}

function syl_moveD() {
    syl_move(2, 1);
}

function syl_moveU() {
    syl_move(2, 2);
}

function syl_moveL() {
    syl_move(1, 1);
}

function syl_moveR() {
    syl_move(1, 2);
}

function syl_find() {
    $('#dyna').append(
	    $('<input>').css({
		'position' : 'absolute',
		'z-index' : '1',
		'left' : '-webkit-calc(50% - 125px)',
		'height' : '20px',
		'width' : '250px',
		'top' : '-webkit-calc(100% - 20px)'
	    }).keyup(
		    function(event) {
			$(syl.wnd.list).removeHighlight();
			syl.wnd.activeselected = 0;

			if (event.keyCode === 27) {
			    $('#dyna').empty();
			}
			if (event.keyCode === 13) {
			    $('#dyna').empty();
			}

			$(syl.wnd.activeele).highlight(
				$(this).val()
					.substring(1, $(this).val().length));
			if ($('.highlight')[0]) {
			    var parent = $($('.highlight')[0]).parents()
				    .filter('div[tabIndex]')[0];
			    var top = $('.highlight')[0].offsetTop
				    - parent.offsetTop - 18;
			    $(parent).scrollTop(top);
			    if (event.keyCode === 13) {
				$($('.highlight')[0]).css('background-color',
					'#FFC107');

			    }
			}

		    }));

    $('#dyna input')[0].focus();
}

function syl_help() {
    var help = $("<div>").css({
	'margin' : '50px auto',
	'width' : '80%'
    });
    $('#mask').empty().css('display', 'block').append(help);

    for (key in syl.key_cnf) {
	if (syl.key_cnf.hasOwnProperty(key)) {
	    var jkey = $('<span>').html(key + ":").css('font-weight', 'bold')
		    .css('padding', '10px');
	    var jvalue = $('<span>').html(syl.key_cnf[key]['help']);
	    var jdiv = $('<div>').css({
		'width' : '50%',
		'margin' : '10px 0',
		'float' : 'left'
	    }).append(jkey).append(jvalue);
	    help.append(jdiv);
	}
    }

    /*
     * var width = help.css('width').replace('px', '');
     * 
     * help.css('width', width + 'px').css('display',
     * 'block').css('margin-left', (width / 2 - width) + 'px');
     */
}

function syl_moveNext() {
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
}

function syl_movePre() {
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
}

function syl_firstLine() {
    syl.wnd.activeele.scrollTop(0);
}

function syl_lastLine() {
    syl.wnd.activeele.scrollTop(syl.wnd.activeele[0].scrollHeight);
}

function syl_activeElement() {
    $('#fkey').empty();

    var interativeEle = $('a,input,div[tabIndex]');
    for (var i = 0; i < interativeEle.length; i++) {
	if ($(interativeEle[i]).parents('.wnd').css('display') == 'none') {
	    continue;
	}
	if (interativeEle[i].tagName.toUpperCase() == 'DIV'
		&& $(interativeEle[i]).attr('class') == 'wnd'
		|| ($(interativeEle[i]).attr('class') && $(interativeEle[i])
			.attr('class').indexOf('ui-menu-item') >= 0)) {
	    continue;
	}

	var tip = $('<div>').attr('class', 'fkey').html(i);
	var position = $(interativeEle[i]).position();
	var top = position.top - tip.css('height').replace(/px/, '');
	var left = position.left - tip.css('width').replace(/px/, '');
	tip.css('top', top);
	tip.css('left', left);
	tip.css('z-index', $(interativeEle[i]).parents('.wnd').css('z-index'));
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
					.toUpperCase() == 'INPUT') {
				    $(interativeEle[ind]).focus();
				    event.preventDefault();
				} else if (interativeEle[ind].tagName
					.toUpperCase() == 'DIV') {
				    $(interativeEle[ind]).focus();
				    event.preventDefault();
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
	var percent_width = parseInt(width.replace(/px/, '')) / (all_width - 8)
		* 100;

	var height = $(syl.wnd.list[0]).css('height');
	var all_height = document.documentElement.clientHeight;
	var percent_height = parseInt(height.replace(/px/, ''))
		/ (all_height - 20 - 8) * 100;

	$(syl.wnd.list[0]).attr('pre-height',
		'\-webkit\-calc(' + Math.ceil(percent_height) + '% - 4px)');
	$(syl.wnd.list[0]).attr('pre-width',
		'\-webkit\-calc(' + Math.ceil(percent_width) + '% - 4px)');
	$(syl.wnd.list[1]).attr('pre-height',
		'\-webkit\-calc(' + Math.ceil(percent_height) + '% - 4px)');
	$(syl.wnd.list[1]).attr(
		'pre-width',
		'\-webkit\-calc(' + (100 - Math.ceil(percent_width))
			+ '% - 4px)');
	$(syl.wnd.list[2]).attr(
		'pre-height',
		'\-webkit\-calc(' + (100 - Math.ceil(percent_height))
			+ '% - 4px)');
	$(syl.wnd.list[2]).attr('pre-width',
		'\-webkit\-calc(' + Math.ceil(percent_width) + '% - 4px)');
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