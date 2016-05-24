$(function() {
    syl.fs = {
	record:null，
	Record:function(from,to,time,content){
	    this.from=from;
	    this.to=to;
	    this.time=time;
	    this.content=content;
	},
	init : function() {
	    window.requestFileSystem = window.requestFileSystem
		    || window.webkitRequestFileSystem;
	    this.req_quota();
	},
	read : function() {
	    window.requestFileSystem(window.PERSISTENT,
		    5 * 1024 * 1024 /* 5MB */, this.read_handler,
		    this.error_handler);
	},
	write : function() {
	    window.requestFileSystem(window.PERSISTENT,
		    5 * 1024 * 1024 /* 5MB */, this.write_handler,
		    this.error_handler);
	},
	req_quota : function() {
	    window.webkitStorageInfo.requestQuota(PERSISTENT,
		    100 * 1024 * 1024, function(grantedBytes) {
			window.requestFileSystem(PERSISTENT, grantedBytes,
				this.quota_handler, this.error_handler);
		    }, function(e) {
			console.log('Error', e);
		    });
	},
	quota_handler : function(fs) {

	},
	
	get_filename:function(){
	    var from = syl.fs.record.from;
	    var to = syl.fs.record.to;
	    var filename = (from>to?to+'-'+from:from+'-'+to);// +'-'+new
								// Date().format("yyyyMMdd");
	    return filename;
	},

	read_handler : function(fs) {

	    fs.root.getFile(this.get_filename(), {}, function(fileEntry) {

		fileEntry.file(function(file) {
		    var reader = new FileReader();

		    reader.onloadend = function(e) {
			// content = this.result;
			// TODO:read the content assign to the argument
			// "content";
			var records = this.result.split('\n');
			if(records.lenght>10){
			    
			}else{
			    
			}
		    };

		    reader.readAsText(file);
		}, this.error_handler);

	    }, this.error_handler);

	},

	write_handler : function(fs) {
	    fs.root.getFile(this.get_filename(), {
		create : true
	    }, function(fileEntry) {

		fileEntry.createWriter(function(fileWriter) {
		    fileWriter.onwriteend = function(e) {
			console.log('Write completed.');
		    };
		    fileWriter.onerror = function(e) {
			console.log('Write failed: ' + e.toString());
		    };
		    // Create a new Blob and write it to log.txt.
		    // var bb = window.BlobBuilder || window.WebKitBlobBuilder;
		    // bb.append('Lorem Ipsum');
		    // fileWriter.write(bb.getBlob('text/plain'));
		    var record = syl.fs.record;
		    var msg = record.from+' '+record.to+' '+record.time+' '+record.content+'\n';
		    fileWriter.seek(fileWriter.length);
		    var blob = new Blob([ msg ]);
		    blob.type = 'text/plain';
		    fileWriter.write(blob);

		}, this.error_handler);

	    }, this.error_handler);
	},

	error_handler : function() {
	    var msg = '';

	    switch (e.code) {
	    case FileError.QUOTA_EXCEEDED_ERR:
		msg = 'QUOTA_EXCEEDED_ERR';
		break;
	    case FileError.NOT_FOUND_ERR:
		msg = 'NOT_FOUND_ERR';
		break;
	    case FileError.SECURITY_ERR:
		msg = 'SECURITY_ERR';
		break;
	    case FileError.INVALID_MODIFICATION_ERR:
		msg = 'INVALID_MODIFICATION_ERR';
		break;
	    case FileError.INVALID_STATE_ERR:
		msg = 'INVALID_STATE_ERR';
		break;
	    default:
		msg = 'Unknown Error';
		break;
	    }
	    console.log('Error: ' + msg);
	}

    }
});
