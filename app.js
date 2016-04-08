var express = require('express'),
	logger = require('morgan'),
	path = require('path'),
	api = require('./api'),
	app = express(),
	publicDir = path.join(__dirname, 'public');

var fs = require('fs'),
	sass = require('node-sass'),
	result = sass.renderSync({
		file: path.join(__dirname, 'sass', 'main.scss'),
		outputStyle: 'expanded'
	});
fs.writeFileSync(path.join(publicDir, 'styles', 'main.css'), result.css.toString());

app.use(logger('dev'));
app.use(express.static(publicDir));
app.use('/api', api);

module.exports = app;