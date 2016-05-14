$(function() {
  syl = {
    touserid: null,
    wnd: {
      list: null,
      activewnd: null,
      index: 0,
      activeele: null,
      activeselected: 0
    },
    init: function() {
      this.signin();
      // this.loadFile();
      this.registerKey();
      this.registerFocus();
      Mousetrap.bind('esc', this.escHandler);
    },
    signin: function() {
      var user = get_user();
      if (user) {
        ajax_send({
          id: user.id,
          token: user.token,
          status: user.status
        }, 'cust/signin', function(data) {
          ajax_main_resp(data, function(data) {
            if (data.level == 1) {
              set_user(data.user)
              update_stat(data.user)
            } else if (data.level == 2) {
              update_stat(null);
              remove_user();
            }
          });
        });
      } else {
        update_stat(null);
      }
    },
    registerFocus: function() {
      syl.wnd.list = $('.wnd');
      $('input, div[tabIndex]').focus(function() {
        $('input,div[tabIndex]').css('border-color', '#a1a1a1');
        for (var i = 0; i < syl.wnd.list.length; i++) {
          $(syl.wnd.list[i]).children('.title').css('opacity', '0.2');
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
        'req': syl_switchwnd,
        'help': 'switch window'
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
        'help': 'command'
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
      'alt+enter': {
        'req': syl_chat_send,
        'help': 'submit chat message'
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
}).autocomplete(
        {
          minLength: 1,
          delay: 10,
          autoFocus: true,

          source: function(request, response) {
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
                  'label': username,
                  'id': n.id
                });
              });

              if (term.lenght == 1) {
                results = users;
              } else {
                var filterUsers = [];
                var matcher = ".*"
                        + term.substr(1, term.length).split("").join(".*")
                        + ".*";
                $.each(users, function(i, n) {
                  if (n.label.match(matcher)) {
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
          position: {
            my: 'left top',
            at: 'left+20px top+20px'
          },
          open: function() {
            $('.ui-autocomplete').css('width', '200px');
          },
          focus: function(event, ui) {
            return false;
          },
          select: function(event, ui) {
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

function syl_activeElement() {
  $('#fkey').empty();

  var interativeEle = $('a,input,div[tabIndex]');
  for (var i = 0; i < interativeEle.length; i++) {
    if ($(interativeEle[i]).parents('.wnd').css('display') == 'none') {
      continue;
    }
    if (interativeEle[i].tagName.toUpperCase() == 'DIV'
            && $(interativeEle[i]).attr('class') == 'wnd'
            || ($(interativeEle[i]).attr('class') && $(interativeEle[i]).attr(
                    'class').indexOf('ui-menu-item') >= 0)) {
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
      Mousetrap.bind((ind + '').split('').join(' '), function(event) {
        if (interativeEle[ind].tagName.toUpperCase() == 'A') {
          var url = $(interativeEle[ind]).attr('href');
          window.open(url);
        } else if (interativeEle[ind].tagName.toUpperCase() == 'INPUT') {
          $(interativeEle[ind]).focus();
          event.preventDefault();
        } else if (interativeEle[ind].tagName.toUpperCase() == 'DIV') {
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
      $(syl.wnd.list[i]).css('width', $(syl.wnd.list[i]).attr('pre-width'));
      $(syl.wnd.list[i]).css('height', $(syl.wnd.list[i]).attr('pre-height'));

      $(syl.wnd.list[i]).removeAttr('pre-width');
      $(syl.wnd.list[i]).removeAttr('pre-height');
    }
    syl.wnd.list.css({
      'float': 'left'
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
  var CMD_CNF = [
      {
        label: 'register',
        app: 'cust',
        value: 'Li,Lei 18848884888 lilei.gmail.com',
        help: 'params--1:lastname,firstname(real name) 2:phone 3:email.<span style="color:red">(phone and email提交后不可修改)</span>',
        response: syl_resp_register

      }, {
        label: 'vcode',
        app: 'cust',
        value: 'code',
        help: 'params--1:验证码',
        response: syl_resp_vcode

      }, {
        label: 'addgroup',
        app: 'cust',
        value: 'groupname',
        help: 'params--1:groupname',
        response: syl_resp_addgroup
      }, {
        label: 'applygroup',
        app: 'cust',
        value: 'groupname',
        help: 'params--1:groupname',
        response: syl_resp_applygroup
      }, {
        label: 'login',
        app: 'cust',
        value: '[email|phone]',
        help: 'params--1:email or phone',
        response: syl_resp_login
      }, {
        label: 'logout',
        app: 'cust',
        value: '',
        help: '',
        response: syl_resp_logout
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
      $("#cmd").val(ui.item.label + ' ');
      syl.showMsg(ui.item.help, 1);
      return false;
    }
  }).keydown(function(event) {
    if (event.keyCode === $.ui.keyCode.TAB) {
      event.preventDefault();
    }
  }).keypress(function(event) {
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
  }).keyup(function(event) {
    if (event.keyCode === 27) {
      syl.showMsg();
      $('#mask').css('display', 'none').empty();
    }
  }).autocomplete("instance")._renderItem = function(ul, item) {
    var tip = $("<span>").html(item.value).css("color", "#B8B8B8");

    var tip_html = $("<div>").append(tip).html();
    var content = "<a>" + item.label + " " + tip_html + "</a>";

    return $("<li>").append(content).appendTo(ul);
  };
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
  if (event.keyCode == 64 && $('#chat_content').val() == '') {

    var userList = JSON.parse(localStorage.getItem('userlist'));

  } else if (event.keyCode == 64 && $('#chat_content').val() == '@') {

  } else if (event.keyCode == 13) {
    if (syl.touserid) {
      if (!$(syl.wnd.activeele).is($('#chat_textarea'))) return;
      var cmd = 'SC';
      var fromuser = get_user();
      if (!fromuser || fromuser.status != 1 || !fromuser.token) return;
      var from = fromuser.id;
      var to = syl.touserid;
      var content = $('#chat_textarea').html();
      var msg = cmd + ' ' + from + ' ' + to + ' ' + content;
      get_ws().send(msg);

    }
  }

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

function syl_switchwnd() {
  event.preventDefault();
  var index = 0;
  for (var i = 0; i < syl.wnd.list.length; i++) {
    if ($(syl.wnd.activewnd).is($(syl.wnd.list[i]))) {
      index = i + 1;
      if (index == 4) index = 0;
      break;
    }
  }
  $(syl.wnd.list[index])[0].focus();
}

function syl_resp_register(data) {
  ajax_mask_resp(data, function(data) {
    if (data.level == 1) {
      update_stat(data.user);
      set_user(data.user);
    }
  });
}

function syl_resp_login(data) {
  ajax_mask_resp(data, function(data) {
    if (data.level == 1) {
      update_stat(data.user);
      set_user(data.user);
    }
  });
}

function syl_resp_logout(data) {
  remove_user();
  update_stat(null);
  mask_empty();
}

function syl_resp_addgroup(data) {
  ajax_mask_resp(data);
}

function syl_resp_applygroup(data) {
  ajax_mask_resp(data);
}

function syl_resp_vcode(data) {
  ajax_mask_resp(data, function(data) {
    if (data.level == 1) {
      set_user(data.user);
      update_stat(data.user);
      data = {
        "msg": "\u9a8c\u8bc1\u6210\u529f",
        "grouplist": [{
          "id": 2,
          "name": "chat1"
        }],
        "userlist": [{
          "username": "lv,wen",
          "status": 0,
          "userids": 0,
          "userid": 100041,
          "groupid": 2,
          "id": 1
        }],
        "user": {
          "status": 1,
          "token": "006da17210a62fb372c0a8b039dab7be",
          "ids": 0,
          "id": 100042,
          "name": "lv,jing"
        },
        "level": 1
      };
      update_userlist(data.userlist);
      update_grouplist(data.grouplist);
    }
  });
}

function update_locallist(list, key) {
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

function get_user() {
  var str = localStorage.getItem('user');
  if (str) { return JSON.parse(str); }
  return null;
}

function set_user(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

function remove_user() {
  localStorage.clear();
}

function ajax_resp(data) {
  if (data.level == 2) {
    syl.showMsg(data.msg, data.level);
  } else {
    syl.showMsg(data.msg, 1);
  }
}

function ajax_main_resp(data, fn) {
  ajax_resp(data);
  if (fn) {
    fn(data);
  }
}

function ajax_mask_resp(data, fn) {
  ajax_resp(data);
  if (data.level == 1) {
    mask_empty();
  }
  if (fn) {
    fn(data);
  }
}

function update_stat(user) {
  if (!user) {
    $('#stat').html('No Signed');
    return;
  }
  var name = user.name;
  if (user.ids > 0) {
    name = name + '(' + user.ids + ')'
  }
  $('#stat').html(
          '<span style="color:' + (user.status == 1 ? 'green' : 'red') + '">'
                  + name + '</span>');
}

function mask_empty() {
  $('#mask').css('display', 'none').empty();
}

function ajax_send(params, url, fn) {
  $.ajax({
    type: 'POST',
    data: params,
    dataType: 'json',
    url: url,
    headers: {
      'X-CSRFToken': syl_getCookie('csrftoken')
    },
    success: function(data) {
      if (fn) {
        fn(data);
      }
    }
  });
}