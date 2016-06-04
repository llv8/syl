$(function() {
    $("#chat_textarea")
	    .bind("keypress", function(event) {
		event.stopPropagation();
	    })
	    .bind("keydown", function(event) {
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
	    })
	    .autocomplete(
		    {
			minLength : 1,
			delay : 10,
			autoFocus : true,
			source : function(request, response) {
			    var term = request.term, results = [];
			    if (term.indexOf("@") === 0
				    && term.split("@").length == 2) {
				var userList = syl.util.get_obj('ul');
				var users = [];
				$.each(userList, function(i, n) {
				    var username = n.n;
				    if (n.is) {
					username += '(' + n.is + ')';
				    }
				    users.push({
					'label' : username,
					'userid' : i
				    });
				});
				var groupList = syl.util.get_obj('gl');
				var groupids = syl.util.get_joined_group();
				$.each(groupList, function(i, n) {
				    var groupname = n.n;
				    if (groupids.has(i)) {
					users.push({
					    'label' : groupname,
					    'userid' : i
					});
				    }
				});

				if (term.lenght == 1) {
				    results = users;
				} else {
				    var filterUsers = [];
				    var matcher = syl.util.single_match(term
					    .substr(1, term.length));
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
			    results.sort(function(a, b) {
				return a['label'] > b['label']
			    })
			    response(results);
			},
			// TODO:动态计算at位置
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
			    if (ui.item.userid > 100000) {
				syl.touser = syl.util.get_obj('ul')[ui.item.userid];
				syl.touser['i'] = ui.item.userid;
			    } else {
				syl.touser = syl.util.get_obj('gl')[ui.item.userid];
				syl.touser['i'] = ui.item.userid;
			    }

			    if (event.keyCode === 13) {
				var range = document.createRange();
				var sel = window.getSelection();
				var nodes = this.childNodes;
				range.setStart(this.childNodes[0],
					this.childNodes[0].length);
				sel.removeAllRanges();
				sel.addRange(range);
			    }
			    return false;
			}
		    }).autocomplete("instance")._renderItem = function(ul, item) {
	var content = $('<a>').html(item.label);
	if (parseInt(item.userid) > 100000) {
	    var color = syl.util.get_obj('ul')[item.userid]['ol'] == 1 ? 'green'
		    : 'red';
	    $(content).css({
		'color' : color
	    });
	}
	return $("<li>").append(content).appendTo(ul);
    };
});
