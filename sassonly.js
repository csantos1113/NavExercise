var
	path = require('path'),
	publicDir = path.join(__dirname, 'public');

var fs = require('fs'),
	sass = require('node-sass'),
	result = sass.renderSync({
		file: path.join(__dirname, 'sass', 'main.scss'),
		outputStyle: 'expanded'
	});
fs.writeFileSync(path.join(publicDir, 'styles', 'main_expanded.css'), result.css.toString());