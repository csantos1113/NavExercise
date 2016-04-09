var express = require('express'),
	logger = require('morgan'),
	path = require('path'),
	api = require('./api'),
	app = express(),
	publicDir = path.join(__dirname, 'public');

app.use(logger('dev'));
app.use(express.static(publicDir));
app.use('/api', api);

module.exports = app;