$(function() {
    syl.tools = {
	init : function() {
	    var id = syl.util.get_id();
	    var filename = 'memo';
	    syl.fs.read(filename, function(data) {
		$('#memo').val(data);
	    });
	    setInterval(function() {
		syl.fs.write(filename, $('#memo').val())
	    }, syl.memo_save);
	}
    }
});
