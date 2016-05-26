$(function() {
    $.extend(syl, {
	touser : null,
	wnd : {
	    list : null,
	    activewnd : null,
	    index : 0,
	    activeele : null,
	    activeselected : 0
	},
	init : function() {
	    this.key.init();
	    this.fs.init();
	    this.util.signin();
	},
    });
    syl.init();

});
