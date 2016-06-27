$(function() {
  syl.tools = {
    init: function() {
      var id = syl.util.get_id();
      if (!id) return;
      var filename = 'memo-' + id;
      syl.fs.read(filename, function(data) {
        $('#memo').val(data);
      });
      setInterval(function() {
        syl.fs.write(filename, $('#memo').val())
      }, syl.memo_save);
    }
  }
});
