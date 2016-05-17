function syl_resp_applygroup(data) {
    ajax_mask_resp(data);
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
    clear_storage();
    update_stat(null);
    mask_empty();
}

function syl_resp_addgroup(data) {
    ajax_mask_resp(data);
}

function syl_resp_approveuser(data) {
    ajax_mask_resp(data);
}

function syl_resp_vcode(data) {
    ajax_mask_resp(data, function(data) {
	if (data.level == 1) {
	    set_user(data.user);
	    update_stat(data.user);
	    update_locallist(data.userlist, 'userlist');
	    update_locallist(data.grouplist, 'grouplist');
	}
    });
}