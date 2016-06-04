syl = {};
$(function() {
    syl.fs = {
	__records : [],
	init : function() {
	    window.requestFileSystem = window.requestFileSystem
		    || window.webkitRequestFileSystem;
	},
	read : function(filename,read_resp) {
	    this.filename = filename;
	    window.requestFileSystem(window.TEMPORARY,
		    50 * 1024 * 1024 /* 50MB */, this.read_handler,
		    this.error_handler);
	},
	write : function(filename, records) {
	    this.filename = filename;
	    this.__records = records;
	    window.requestFileSystem(window.TEMPORARY,
		    50 * 1024 * 1024 /* 50MB */, this.write_handler,
		    this.error_handler);
	},

	show_quota : function() {
	    navigator.webkitTemporaryStorage.queryUsageAndQuota(function(
		    usedBytes, grantedBytes) {
		console.log('we are using ', usedBytes, ' of ', grantedBytes,
			'bytes');
	    }, function(e) {
		console.log('Error', e);
	    });
	},
	read_handler : function(fs) {
	    fs.root.getFile(syl.fs.filename, {}, function(fileEntry) {

		fileEntry.file(function(file) {
		    var reader = new FileReader();

		    reader.onloadend = function(e) {
			// content = this.result;
			// TODO:read the content assign to the argument
			// "content";
			var records = this.result.split('\n');
			var lastestrecords = records.lenght > 10 ? records
				.slice(records.length - 10, records.length)
				: records.slice(0, records.length);
			var rs = [];
			for (var i = 0; i < lastestrecords.length; i++) {
			    rs.push(JSON.parse(lastestrecords[i]));
			}
			syl.fs.read_resp(rs);
		    };
		    reader.readAsText(file);
		}, this.error_handler);

	    }, this.error_handler);

	},

	add_line_num : function(record) {
	    if (syl.fs.filename.indexOf('chat')) {
        	    var id = syl.util.get_obj('u')['i'];
        	    var date = syl.util.get_date( record['t'],'yyyyMMdd');
        	    var key = date + '-' + id;
        	    var line_num = syl.util.get_obj(key);
        	    if (line_num) {
        		syl.util.set_obj(key, line_num + 1);
        	    } else {
        		syl.util.set_obj(key, 1);
        	    }
        	    syl.util.set_obj('lastr-'+id,date);
	    }
	},

	load_records : function() {
	    var id = syl.util.get_obj('u')['i'];
	    var last_record_date = syl.util.get_obj('lastr-'+id);
	    var line_num = null；
	    if(last_record_date){
		var key = last_record_date + '-' + id;
		line_num = syl.util.get_obj(key);
	    }else{
		// 只获取最新一个月数据
	    }
		    var cmd = 'CHAT_LOG';
		    syl.ws.send({
			'cmd' : 'CHAT_LOG',
			'uid' : id,
			'ln':line_num,
			'd':last_record_date
		    });
	},

	write_handler : function(fs) {
	    fs.root.getFile(syl.fs.filename, {
		create : true
	    }, function(fileEntry) {
		fileEntry.createWriter(function(fileWriter) {
		    fileWriter.onwriteend = function(e) {
			// 正好跨天的信息可能出现yyyyMMdd不同步
			add_line_num(syl.fs.r);
			console.log('Write completed.');
		    };
		    fileWriter.onerror = function(e) {
			console.log('Write failed: ' + e.toString());
		    };
		    var records = syl.fs.__records;
		    var msg = '';
		    if (!(records instanceof Array)) {
			records = [JSON.stringify(records)];
		    }
		    fileWriter.seek(fileWriter.length);

        		for (var i = 0; i < records.length; i++) {
        		    var record = records[i];
        		    msg = JSON.stringify(record) + '\n';
        		    var blob = new Blob([ msg ], {
        			type : 'text/plain'
        		    });
        		    syl.fs.r = record;
        		    fileWriter.write(blob);
        		}
		}, this.error_handler);

	    }, this.error_handler);
	},

	error_handler : function(e) {
	    console.log(e.name + ': ' + e.message);
	}

    }
    syl.fs.init();
    syl.fs.show_quota();
});
