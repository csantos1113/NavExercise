var
	path = require('path'),
	publicDir = path.join(__dirname, 'public');

var fs = require('fs'),
	sass = require('node-sass'),
	result = sass.renderSync({
		file: path.join(__dirname, 'sass', 'main.scss'),
		outputStyle: 'compact'
	});
fs.writeFileSync(path.join(publicDir, 'styles', 'main.css'), result.css.toString());