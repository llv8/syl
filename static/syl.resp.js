$(function() {
    var resp = {
	init : function() {
	    syl.resp = this;
	},
	applygroup : function(data) {
	    syl.util.ajax_mask_resp(data);
	},
	register : function(data) {
	    syl.util.ajax_mask_resp(data, function(data) {
		if (data.level == 1) {
		    syl.util.update_stat(data.user);
		    syl.util.set_obj('user', data.user);
		}
	    });
	},
	login : function(data) {
	    syl.util.ajax_mask_resp(data, function(data) {
		if (data.level == 1) {
		    syl.util.update_stat(data.user);
		    syl.util.set_obj('user', data.user);
		}
	    });
	},
	logout : function(data) {
	    syl.util.clear_storage();
	    syl.util.update_stat(null);
	    syl.util.mask_empty();
	},

	addgroup : function(data) {
	    syl.util.ajax_mask_resp(data);
	},

	approveuser : function(data) {
	    syl.util.ajax_mask_resp(data);
	},

	vcode : function(data) {
	    syl.util.ajax_mask_resp(data, function(data) {
		if (data.level == 1) {
		    syl.util.set_obj('user',data.user);
		    syl.util.update_stat(data.user);
		    syl.util.update_locallist(data.userlist, 'userlist');
		    syl.util.update_locallist(data.grouplist, 'grouplist');
		}
	    });
	}
    }
    resp.init();
});
