$(function() {
    $.extend(syl, {
	touser : null,
	wnd : {
	    index : 0,
	},
	init : function() {
	    this.key.init();
	    this.fs.init();
	    $("#tech_tabs").tabs();
	    $("#tools_tabs").tabs();
	    this.util.userstatus();
	},
    });
    syl.init();

});
