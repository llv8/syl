
var sy_prefixKey;
var sy_valueKey = '';
function sy_dispatchKeyHandler(e) {
	var pressKey = String.fromCharCode(e.keyCode);
	var keyHandler = sy_keyConf[pressKey];
	if (keyHandler) {
		sy_prefixKey = pressKey;
		if (keyHandler['resp']) {
			setTimeout(function() {
				keyHandler['resp']()
			}, 1000);
		}
		if (this === document) {
			if (pressKey !== 'o') {
				return;
			}
		}
		keyHandler['req'](e, $(this));
	} else {
		if (sy_prefixKey) {
			sy_valueKey += pressKey;
		}
	}
}

function activeUrl(e, $this) {
}

function openWinOrTab(e, $this) {
	console.log($('.sy_win_close_index'));
	$('.sy_win_close_index').css({
		'color' : 'red'
	});
}
function openWinOrTabResp() {
	$('#sy_win_' + sy_valueKey).css({
		display : 'block'
	});
	$('#sy_win_' + sy_valueKey + ' .sy_context').focus();
	$('#sy_close_win_' + sy_valueKey).remove();
	sy_prefixKey = '';
	sy_valueKey = '';
}

function closeWinOrTab(e, $this) {
	var id = $this.attr('id');
	var index = getSyIndex(id);
	$('.sy_close_wins').append(
			'<span class="sy_close_win" id="sy_close_win_' + index + '">'
					+ $('#' + id + ' .sy_head_name').html()
					+ '[<span class="sy_win_close_index">' + index + '</span>]'
					+ '</span>');
	$this.css({
		display : 'none'
	});
	$($('.sy_win:visible .sy_context').get(0)).focus();
}
function sy_activeWinOrTab(e, $this) {
	$('.sy_win_index').css({
		'color' : 'red'
	});
}
function sy_activeWinOrTabResp() {
	$('#sy_context_' + sy_valueKey).focus();
	$('.sy_win_index').css({
		'color' : '#FFFFFF'
	});
	sy_prefixKey = '';
	sy_valueKey = '';
}
function sy_minOrMax(e, $this) {
	// var offsettop = $('.sy_wins').css('top') - $this.css('top');
	// var offsetleft = $('.sy_wins').css('left') - $this.css('left');
	console.log($('.sy_wins').get(0).top);
	// console.log(offsetleft);
	// $this.css({left:offsetleft,top:offsettop,'z-index':999});
}
function sy_switchWinOrTab(e, $this) {
}
function sy_moveLeft(e, $this) {
}
function sy_moveRight(e, $this) {
}
function sy_moveDown(e, $this) {
}
function sy_moveUp(e, $this) {
}
function sy_scrollLeft(e, $this) {
}
function sy_scrollRight(e, $this) {
}
function sy_scrollDown(e, $this) {
}
function sy_scrollUp(e, $this) {
}
function sy_find(e, $this) {
}
function sy_command(e, $this) {
}
function sy_help(e, $this) {
	var helpObj = {};
	for (key in sy_keyConf) {
		if (sy_keyConf.hasOwnProperty(key)) {
			helpObj[key] = sy_keyConf[key]['help'];
		}
	}
	// TODO:add dialog show this help message
	console.log(helpObj);
}

$(function() {
	syl={
			user:{
				name:,
				staus:,
				loc:,
			},
			init:function(){
				this.login();
				this.loadFile();
				this.registerKey();
			},
			key_cnf:{
				'f' : {
					'req' : activeUrl,
					'help' : 'active url'
				},
				'o' : {
					'req' : openWinOrTab,
					'resp' : openWinOrTabResp,
					'help' : 'open window or tab'
				},
				'x' : {
					'req' : closeWinOrTab,
					'help' : 'close window or tab'
				},
				'a' : {
					'req' : activeWinOrTab,
					'resp' : activeWinOrTabResp,
					'help' : 'active window or tab'
				},
				'm' : {
					'req' : minOrMax,
					'help' : 'maximized window or restore window'
				},
				's' : {
					'req' : switchWinOrTab,
					'help' : 'switch window or tab'
				},
				'H' : {
					'req' : moveLeft,
					'help' : 'extend window left'
				},
				'L' : {
					'req' : moveRight,
					'help' : 'extend window right'
				},
				'J' : {
					'req' : moveDown,
					'help' : 'extend window down'
				},
				'K' : {
					'req' : moveUp,
					'help' : 'extend window up'
				},
				'h' : {
					'req' : scrollLeft,
					'help' : 'scroll window left'
				},
				'l' : {
					'req' : scrollRight,
					'help' : 'scroll window right'
				},
				'j' : {
					'req' : scrollDown,
					'help' : 'scroll window down'
				},
				'k' : {
					'req' : scrollUp,
					'help' : 'scroll window up'
				}
			},

			registerKey:function(){
			    for(var key in this.key_cnf){
				Mousetrap.bind(key, key_cnf[key]['req']);
			    }
			}
		}

});

function sy_focus(e) {
	if ($(this).attr('class') === 'sy_head'
			|| $(this).attr('class') === 'sy_context') {
		$('.sy_win .sy_head').css({
			opacity : 0.5
		});
		if ($(this).attr('class') === 'sy_head') {
			$(this).css({
				opacity : 1
			});
		} else {
			$(this).siblings('.sy_head').css({
				opacity : 1
			});
		}
	}
}


function getSyIndex(id) {
	return id.substr(id.lastIndexOf('_') + 1, id.length)
}


function show_msg(msg, level) {
	if (!msg) {
		$('#msg').empty(); 
		return;
	}
	
	if(!level){
		levle=1;
	}

	// level--1:info,2:error
	$('#msg').html(msg).css('display','block').css('color',
			level === 1 ? 'green' : (level === 2 ? 'red' : ''));
	
}
