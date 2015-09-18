var File = function(name, type, path, stat) {
	this.name = name
	this.type = type
	this.path = path
	this.stat = stat
}

var path = require('path'),
	http = require('http')
module.exports = {
	parseDirContent: function(dir, files) {
		var information = []
		var fileType = require('file-type')
		var readChunk = require('read-chunk')

		files.forEach(function(file) {
			var filepath = path.join(dir, file)
			var stat = require('fs').statSync(filepath)
			var type
			try {
				var buffer = readChunk.sync(filepath, 0, 262);
				type = fileType(buffer)
			} catch (EISDIR) {
				type = {
					'ext': null,
					'mime': 'directory'
				}
			}



			information.push(
				new File(file, type, dir.replace("/Users", ""), stat)
			)
		})
		return information
	},

	getFileInfo: function(filepath) {
		var fileType = require('file-type')
		var readChunk = require('read-chunk')

		var type
		var size = require('fs').statSync(filepath)['size']
		try {
			var buffer = readChunk.sync(filepath, 0, 262);
			type = fileType(buffer)
		} catch (EISDIR) {
			type = {
				'ext': null,
				'mime': 'directory'
			}
		}

		return {
			'size': size,
			'type': (type ? type : {'ext':'unknown', 'mime': 'unknown'})
		}
	},

	pipe: function(url, res) {
		var request = http.get(url, function(response) {
			res.writeHead(response.statusCode, response.headers)
			response.pipe(res);
		});

		request.on('error', function(error) {
			res.statusCode = 500;
			res.end(error.message);
		});
	}

}