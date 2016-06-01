syl = {};
$(function() {
  syl.fs = {
    __records: [],
    init: function() {
      window.requestFileSystem = window.requestFileSystem
              || window.webkitRequestFileSystem;
    },
    read: function(filename) {
      this.filename = filename;
      window.requestFileSystem(window.TEMPORARY, 50 * 1024 * 1024 /* 50MB */,
              this.read_handler, this.error_handler);
      return this.__records;
    },
    write: function(filename, records) {
      this.filename = filename;
      this.__records = records;
      window.requestFileSystem(window.TEMPORARY, 50 * 1024 * 1024 /* 50MB */,
              this.write_handler, this.error_handler);
    },

    show_quota: function() {
      navigator.webkitTemporaryStorage.queryUsageAndQuota(function(usedBytes,
              grantedBytes) {
        console.log('we are using ', usedBytes, ' of ', grantedBytes, 'bytes');
      }, function(e) {
        console.log('Error', e);
      });
    },
    read_handler: function(fs) {
      fs.root.getFile(syl.fs.filename, {}, function(fileEntry) {

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
            syl.fs.__records = [];
            for (var i = 0; i < lastestrecords.length; i++) {
              syl.fs.__records.push(JSON.parse(lastestrecords[i]));
            }
          };
          reader.readAsText(file);
        }, this.error_handler);

      }, this.error_handler);

    },

    write_handler: function(fs) {
      fs.root.getFile(syl.fs.filename, {
        create: true
      }, function(fileEntry) {
        fileEntry.createWriter(function(fileWriter) {
          fileWriter.onwriteend = function(e) {
            syl.fs.__records = [];
            console.log('Write completed.');
          };
          fileWriter.onerror = function(e) {
            console.log('Write failed: ' + e.toString());
          };
          var records = syl.fs.__records;
          var msg = '';
          if (records instanceof Array) {
            for (var i = 0; i < records.length; i++) {
              var record = records[i];
              msg += JSON.stringify(record) + '\n';
            }
          } else {
            msg = JSON.stringify(records) + '\n';
          }

          fileWriter.seek(fileWriter.length);
          var blob = new Blob([msg], {
            type: 'text/plain'
          });
          fileWriter.write(blob);

        }, this.error_handler);

      }, this.error_handler);
    },

    error_handler: function(e) {
      console.log(e.name + ': ' + e.message);
    }

  }
  syl.fs.init();
  syl.fs.show_quota();
});
