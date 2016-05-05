$(function() {
  syl = {
    user: null,
    wnd: {
      list: null,
      activewnd: null,
      index: 0,
      activeele: null,
      activeselected: 0
    },
    init: function() {
      // this.login();
      // this.loadFile();
      if (this.user == null) {
        $('#stat').html('Not signed')
      }
      this.registerKey();
      this.registerFocus();
      Mousetrap.bind('esc', this.escHandler);
      $('input,textarea').keyup(this.escHandler);
      $('#chat_textarea').keypress(syl_chat_send);

    },
    registerFocus: function() {
      syl.wnd.list = $('.wnd');
      $('input,textarea, div[tabIndex]').focus(function() {
        $('input,textarea,div[tabIndex]').css('border-color', '#a1a1a1');
        for (var i = 0; i < syl.wnd.list.length; i++) {
          $(syl.wnd.list[i]).children('.title').css('opacity', '0.5');
        }
        if ($(this).attr('class') == 'wnd') {
          $(this).children('.title').css('opacity', '1');
          syl.wnd.activewnd = $(this);
        } else {
          $(this).parents('.wnd').children('.title').css('opacity', '1');
          syl.wnd.activewnd = $(this).parents('.wnd');
        }
        $(this).css('border-color', '#ffa500');
        syl.wnd.activeele = $(this);
      });
      $(syl.wnd.list[0]).focus();
    },
    key_cnf: {
      'f': {
        'req': syl_activeElement,
        'help': 'active element'
      },

      'm': {
        'req': syl_maxOrMinWnd,
        'help': 'maximized window or restore window'
      },
      '/': {
        'req': syl_find,
        'help': 'find'
      },
      'alt+s': {
        'req': function() {

        },
        'help': 'switch style'
      },
      'H': {
        'req': syl_moveL,
        'help': 'extend window left'
      },
      'L': {
        'req': syl_moveR,
        'help': 'extend window right'
      },

      'n': {
        'req': syl_moveNext,
        'help': 'move to next selected'
      },
      'N': {
        'req': syl_movePre,
        'help': 'move to previous selected'
      },

      'J': {
        'req': syl_moveD,
        'help': 'extend window down'
      },
      'K': {
        'req': syl_moveU,
        'help': 'extend window up'
      },
      'h': {
        'req': syl_scrollL,
        'help': 'scroll window left'
      },
      'l': {
        'req': syl_scrollR,
        'help': 'scroll window right'
      },
      'j': {
        'req': syl_scrollD,
        'help': 'scroll window down'
      },
      'k': {
        'req': syl_scrollU,
        'help': 'scroll window up'
      },
      'g g': {
        'req': syl_firstLine,
        'help': 'first line'
      },
      'G': {
        'req': syl_lastLine,
        'help': 'last line'
      },
      'alt+f': {
        'req': syl_command,
        help: 'command'
      },
      'alt+1': {
        'req': function(event) {
          event.preventDefault();
          syl.wnd.list[0].focus();
        },
        'help': 'active window 1'
      },
      'alt+2': {
        'req': function(event) {
          event.preventDefault();
          syl.wnd.list[1].focus();
        },
        'help': 'active window 2'
      },
      'alt+3': {
        'req': function(event) {
          event.preventDefault();
          syl.wnd.list[2].focus();
        },
        'help': 'active window 3'
      },
      'alt+4': {
        'req': function(event) {
          event.preventDefault();
          syl.wnd.list[3].focus();
        },
        'help': 'active window 4'
      },
      '?': {
        'req': syl_help,
        'help': 'help'
      },
    },

    registerKey: function() {
      for ( var key in this.key_cnf) {
        Mousetrap.bind(key, this.key_cnf[key]['req']);
      }
    },
    escHandler: function(event) {
      if ($('.highlight').length > 0) {
        $(syl.wnd.list).removeHighlight();
      } else if ($('#mask').css('display') == 'block') {
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
    unregisterKey: function() {
      for ( var key in this.key_cnf) {
        Mousetrap.unbind(key);
      }
    },
    showMsg: function(msg, level) {
      $('#msg').empty();
      if (!level) {
        levle = 1;
      }

      // level--1:info,2:error
      $('#msg').html(msg).css('display', 'block').css('color',
              level === 1 ? 'green' : (level === 2 ? 'red' : ''));

    },
    showMask: function(msg) {
      $('#mask').empty();
      $('#mask').html(msg).css('display', 'block');

    }
  }

  syl.init();

});

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
      Mousetrap.bind((ind + '').split('').join(' '), function(event) {
        if (interativeEle[ind].tagName.toUpperCase() == 'A') {
          var url = $(interativeEle[ind]).attr('href');
          window.open(url);
        } else if (interativeEle[ind].tagName.toUpperCase() == 'INPUT'
                || interativeEle[ind].tagName.toUpperCase() == 'TEXTAREA') {
          $(interativeEle[ind]).focus();
          event.preventDefault();
        } else if (interativeEle[ind].tagName.toUpperCase() == 'DIV') {
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
      $(syl.wnd.list[i]).css('width', $(syl.wnd.list[i]).attr('pre-width'));
      $(syl.wnd.list[i]).css('height', $(syl.wnd.list[i]).attr('pre-height'));

      $(syl.wnd.list[i]).removeAttr('pre-width');
      $(syl.wnd.list[i]).removeAttr('pre-height');
    }
    syl.wnd.list.css({
      'float': 'left'
    });
  } else {
    /*
     * for (var i = 0; i < syl.wnd.list.length; i++) { var width =
     * $(syl.wnd.list[i]).css('width'); var all_width =
     * document.documentElement.clientWidth; var percent_width =
     * parseInt(width.replace(/px/, '')) / (all_width - 8) 100 + '%';
     * 
     * var height = $(syl.wnd.list[i]).css('height'); var all_height =
     * document.documentElement.clientHeight; var percent_height =
     * parseInt(height.replace(/px/, '')) / (all_height - 20 - 8) * 100 + '%';
     * 
     * $(syl.wnd.list[i]).attr('pre-width', percent_width);
     * $(syl.wnd.list[i]).attr('pre-height', percent_height); }
     */
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
    $(syl.wnd.list[1]).attr('pre-width',
            '\-webkit\-calc(' + (100 - Math.ceil(percent_width)) + '% - 4px)');
    $(syl.wnd.list[2]).attr('pre-height',
            '\-webkit\-calc(' + (100 - Math.ceil(percent_height)) + '% - 4px)');
    $(syl.wnd.list[2]).attr('pre-width',
            '\-webkit\-calc(' + Math.ceil(percent_width) + '% - 4px)');
    $(syl.wnd.list[3]).attr('pre-height',
            '\-webkit\-calc(' + (100 - Math.ceil(percent_height)) + '% - 4px)');
    $(syl.wnd.list[3]).attr('pre-width',
            '\-webkit\-calc(' + (100 - Math.ceil(percent_width)) + '% - 4px)');

    $(syl.wnd.list).css('display', 'none');

    syl.wnd.activewnd.css('display', 'block').css({
      'z-index': 499,
      'top': 0,
      'left': 0,
      'position': 'relative',
      'width': '-webkit-calc(100% - 4px)',
      'height': '-webkit-calc(100% - 4px)',
    });
  }
}

function syl_calcPx(px, val) {
  return parseInt(px.replace(/px/, '')) + val;
}

function syl_command(event) {

  event.preventDefault();
  var CMD_CNF = [{
    label: 'register',
    app: 'cust',
    value: 'Li,Lei 18848884888 lilei.gmail.com',
    help: 'params--1:lastname,firstname 2:phone 3:email',
    valid: syl_valid_register,
    response: syl_resp_register

  }, {
    label: 'addgroup',
    app: 'cust',
    value: 'groupname',
    help: 'params--1:groupname'
  }, {
    label: 'applygroup',
    app: 'cust',
    value: 'groupname',
    help: 'params--1:groupname'
  }, {
    label: 'login',
    app: 'cust',
    value: '[email|phone]',
    help: 'params--1:email or phone'
  }, {
    label: 'logout',
    app: 'cust',
    value: '',
    help: ''
  }

  ];
  var input = $('<input>').attr('id', 'cmd');
  $('#mask').append(input).css('display', 'block');
  input[0].focus();

  $("#cmd").autocomplete({
    minLength: 1,
    delay: 10,
    autoFocus: true,
    source: CMD_CNF,
    position: {
      my: 'left top',
      at: 'left bottom'
    },
    search: function(event, ui) {
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
    focus: function(event, ui) {
      return false;
    },
    select: function(event, ui) {
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
          cmd.cmd_line = cmd_line;
          $.ajax({
            type: 'POST',
            data: 'cmd=' + cmd_line,
            dataType: 'json',
            url: cmd.app + '/' + cmd.label,
            headers: {
              'X-CSRFToken': syl_getCookie('csrftoken')
            },
            success: function(data) {
              cmd.response(data);
            }
          });
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
        $(syl.wnd.list[2]).css('height',
                '\-webkit\-calc(' + (100 - Math.ceil(percenttop)) + '% - 4px)');
        $(syl.wnd.list[3]).css('height',
                '\-webkit\-calc(' + (100 - Math.ceil(percenttop)) + '% - 4px)');
      } else {
        $(syl.wnd.list[0]).css('height',
                '\-webkit\-calc(' + Math.floor(percenttop) + '% - 4px)');
        $(syl.wnd.list[1]).css('height',
                '\-webkit\-calc(' + Math.floor(percenttop) + '% - 4px)');
        $(syl.wnd.list[2])
                .css(
                        'height',
                        '\-webkit\-calc(' + (100 - Math.floor(percenttop))
                                + '% - 4px)');
        $(syl.wnd.list[3])
                .css(
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
        $(syl.wnd.list[0]).css('width',
                '\-webkit\-calc(' + Math.ceil(percentleft) + '% - 4px)');
        $(syl.wnd.list[2]).css('width',
                '\-webkit\-calc(' + Math.ceil(percentleft) + '% - 4px)');
        $(syl.wnd.list[1])
                .css(
                        'width',
                        '\-webkit\-calc(' + (100 - Math.ceil(percentleft))
                                + '% - 4px)');
        $(syl.wnd.list[3])
                .css(
                        'width',
                        '\-webkit\-calc(' + (100 - Math.ceil(percentleft))
                                + '% - 4px)');
      } else {
        $(syl.wnd.list[0]).css('width',
                '\-webkit\-calc(' + Math.floor(percentleft) + '% - 4px)');
        $(syl.wnd.list[2]).css('width',
                '\-webkit\-calc(' + Math.floor(percentleft) + '% - 4px)');
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
            'position': 'absolute',
            'z-index': '1',
            'left': '-webkit-calc(50% - 125px)',
            'height': '20px',
            'width': '250px',
            'top': '-webkit-calc(100% - 20px)'
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
                            $(this).val().substring(1, $(this).val().length));
                    if ($('.highlight')[0]) {
                      var parent = $($('.highlight')[0]).parents().filter(
                              'div[tabIndex]')[0];
                      var top = $('.highlight')[0].offsetTop - parent.offsetTop
                              - 18;
                      $(parent).scrollTop(top);
                      if (event.keyCode === 13) {
                        $($('.highlight')[0])
                                .css('background-color', '#FFC107');

                      }
                    }

                  }));

  $('#dyna input')[0].focus();
}

function syl_help() {
  var help = $("<div>").css({
    'margin': '50px auto',
    'width': '80%'
  });
  $('#mask').empty().css('display', 'block').append(help);

  for (key in syl.key_cnf) {
    if (syl.key_cnf.hasOwnProperty(key)) {
      var jkey = $('<span>').html(key + ":").css('font-weight', 'bold').css(
              'padding', '10px');
      var jvalue = $('<span>').html(syl.key_cnf[key]['help']);
      var jdiv = $('<div>').css({
        'width': '50%',
        'margin': '10px 0',
        'float': 'left'
      }).append(jkey).append(jvalue);
      help.append(jdiv);
    }
  }

  /*
   * var width = help.css('width').replace('px', '');
   * 
   * help.css('width', width + 'px').css('display', 'block').css('margin-left',
   * (width / 2 - width) + 'px');
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

function syl_chat_send(event) {
  ws_send();
}

function syl_getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie != '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
      if (cookie.substring(0, name.length + 1) == (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function syl_valid_register(cmd_line) {
  var params = cmd_line.split(/\s+/);
  var err_msg = '';
  if (params.length != 4) {
    err_msg = 'parameter more or less!';
  } else if (params[1].length >= 50) {
    err_msg = 'user name is too long!';
  } else if (params[1].split(',').length != 2) {
    err_msg = 'user name is invalid!';
  } else if (!(params[1].split(',')[0].length > 0 && params[1].split(',')[1].length > 0)) {
    err_msg = 'user name is invalid!';
  } else if (!params[2].match(/^1[3|5|7|8|][0-9]{9}$/)) {
    err_msg = 'phone is invalid!';
  } else if (params[3].length >= 50) {
    err_msg = 'email is too long!';
  } else if (!params[3].match(/^[A-Z0-9a-z_%+-]+@[A-Za-z0-9-]+.[A-Za-z]{2,4}$/)) {
    err_msg = 'email is invalid!';
  }
  return err_msg;
}

function syl_resp_register(data) {
  if (data.level == 2) {
    syl.showMsg(data.msg, data.level);
  } else {
    syl.showMsg(data.msg, 1);
    $('#mask').css('display', 'none').empty();
    syl.user = data.user;
    var name = syl.user.name;
    if (syl.user.ids > 0) {
      name = name + '(' + syl.user.ids + ')'
    }
    var status = (syl.user.status == 0) ? 'inactive' : 'active';
    $('#stat').html(name + '/' + status);
  }
}
