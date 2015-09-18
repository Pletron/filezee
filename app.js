var express = require('express'),
	favicon = require('serve-favicon'),
	fs = require('fs'),
	path = require('path'),
	util = require('./util'),
	app = express()


// var directory = path.join(__dirname, '_public')
var directory = "/Users"
var files;


app.use(favicon(path.join(__dirname, 'templates', 'images', 'favicon.ico')));
app.set('view engine', 'jade')
app.set('views', path.join(__dirname, 'templates'))



app.get('/', function(req, res) {
	var requestPath = directory
	fs.readdir(directory, function(err, items) {
		if (err) {
			switch (err.code) {
				case 'ENOTDIR':
					fs.appendFile('download.log', 'File ' + decodeURI(err.path) + ' was downloaded by ' + req.connection.remoteAddress)
					return res.download(decodeURI(err.path))
				default:
					return res.sendStatus(500)
			}
		}

		res.render('main', {
			"files": util.parseDirContent(requestPath, items)
		})
	})

})

app.get('/*', function(req, res) {
	var requestPath = path.join(directory, req.originalUrl)

	fs.readdir(requestPath, function(err, items) {
		if (err) {
			var filepath = decodeURI(err.path)
			app.use(express.static(filepath))
			switch (err.code) {
				case 'ENOTDIR':
					return res.sendFile(filepath)
				case 'ENOENT':
					return res.sendFile(filepath)
				default:
					return res.send(JSON.stringify(err))
			}
		}

		var previousURL = requestPath.replace(directory, "").split('/')
		previousURL.pop()
		previousURL = previousURL.join('/')
		if (!previousURL)
			previousURL = '/'

		res.render('main', {
			"files": util.parseDirContent(requestPath, items),
			"previousURL": previousURL
		})
	})

})

app.listen(3030, function(err) {
	if (err)
		return console.error('Port error', err)

	console.log('Listening to port 3030')
})