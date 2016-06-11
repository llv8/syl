$(function() {
    $.extend(syl, {
	touser : null,
	ws_hb : 10 * 1000,
	ws_check_ol : 10 * 1000,
	refresh_data : 10 * 1000,
	memo_save : 10 * 1000,
	init : function() {
	    this.key.init();
	    this.fs.init();
	    $(".tabs").tabs();
	    this.util.userstatus();
	},
    });
    syl.init();

});
