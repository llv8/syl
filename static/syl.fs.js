syl = {};
$(function() {
  syl.fs = {
    init: function() {
      window.requestFileSystem = window.requestFileSystem
              || window.webkitRequestFileSystem;
      window.directoryEntry = window.directoryEntry
              || window.webkitDirectoryEntry;
    },
    read: function(filename, read_resp) {
      var read_handler = function(fs) {
        fs.root.getFile(filename, {}, function(fileEntry) {

          fileEntry.file(function(file) {
            var reader = new FileReader();

            reader.onloadend = function(e) {
              // content = this.result;
              // TODO:read the content assign to the argument
              // "content";
              var records = this.result.split('\n');
              var lastestrecords = records.lenght > 10 ? records.slice(
                      records.length - 10, records.length) : records.slice(0,
                      records.length);
              var rs = [];
              for (var i = 0; i < lastestrecords.length; i++) {
                if (lastestrecords[i]) rs.push(JSON.parse(lastestrecords[i]));
              }
              if (read_resp) read_resp(rs);
            };
            reader.readAsText(file);
          }, this.error_handler);

        }, this.error_handler);

      };
      window.requestFileSystem(window.TEMPORARY, 50 * 1024 * 1024 /* 50MB */,
              read_handler, this.error_handler);
    },
    write: function(filename, records, write_resp) {
      this.filename = filename;
      var write_handler = function(fs) {
        fs.root.getFile(filename, {
          create: true
        }, function(fileEntry) {
          fileEntry.createWriter(function(fileWriter) {
            fileWriter.onwriteend = function(e) {
              console.log('Write completed.');
              if (write_resp) {
                write_resp();
              }
            };
            fileWriter.onerror = function(e) {
              console.log('Write failed: ' + e.toString());
            };
            var msg = '';
            if (!(records instanceof Array)) {
              records = [records];
            }
            fileWriter.seek(fileWriter.length);
            for (var i = 0; i < records.length; i++) {
              var record = records[i];
              msg += JSON.stringify(record) + '\n';
              syl.fs.add_line_num(record);
            }
            var blob = new Blob([msg], {
              type: 'text/plain'
            });
            fileWriter.write(blob);
          }, this.error_handler);

        }, this.error_handler);
      }
      window.requestFileSystem(window.TEMPORARY, 50 * 1024 * 1024 /* 50MB */,
              write_handler, this.error_handler);
    },
    remove: function(filename) {
      window.requestFileSystem(window.TEMPORARY, 50 * 1024 * 1024 /* 50MB */,
              function(fs) {
                fs.root.getFile(filename, {}, function(fileEntry) {
                  fileEntry.remove(function() {
                    console.log(filename + ' deleted.')
                  }, syl.fs.error_handler);
                });
              }, this.error_handler);
    },

    remove_all: function() {
      syl.fs.list(function(filelist) {
        for ( var key in filelist) {
          syl.fs.remove(filelist[key].name);
        }
      });

    },

    list: function(fn) {
      window.requestFileSystem(window.TEMPORARY, 50 * 1024 * 1024,
              function(fs) {

                var dirReader = fs.root.createReader();
                var entries = [];

                // Keep calling readEntries() until no more results are
                // returned.
                var readEntries = function() {
                  dirReader.readEntries(function(results) {
                    if (!results.length) {
                      for ( var key in entries) {
                        console.log(entries[key].name);
                      }
                      if (fn) fn(entries);

                    } else {
                      entries = entries.concat(results);
                      readEntries();
                    }
                  });
                };
                // Start reading the directory.
                readEntries();

              }, this.error_handler);
    },

    show_quota: function() {
      navigator.webkitTemporaryStorage.queryUsageAndQuota(function(usedBytes,
              grantedBytes) {
        console.log('we are using ', usedBytes, ' of ', grantedBytes, 'bytes');
      }, function(e) {
        console.log('Error', e);
      });
    },

    add_line_num: function(record) {
      if (record['cmd']
              && (record['cmd'] == 'CHAT' || record['cmd'] == 'CHAT_ACK')) {
        var id = syl.util.get_id();
        var date = syl.util.get_date(record['t'], 'yyyyMMdd');
        var key = date + '-' + id;
        var line_num = syl.util.get_b(key);
        if (line_num) {
          syl.util.set_b(key, parseInt(line_num) + 1);
        } else {
          syl.util.set_b(key, 1);
        }
        syl.util.set_b('lastr-' + id, date);
      }
    },

    load_records: function() {
      var id = syl.util.get_id();
      var last_record_date = syl.util.get_b('lastr-' + id);
      var line_num = null;
      if (last_record_date) {
        var key = last_record_date + '-' + id;
        line_num = syl.util.get_obj(key);
      } else {
        // 只获取最新一个月数据
      }
      var cmd = 'CHAT_LOG';
      syl.ws.send({
        'cmd': 'CHAT_LOG',
        'uid': id,
        'ln': line_num,
        'd': last_record_date
      });
    },
    error_handler: function(e) {
      console.log(e.name + ': ' + e.message);
    }
  };

  syl.fs.init();
  syl.fs.show_quota();
});
