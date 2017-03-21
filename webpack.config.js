var path = require('path');
var config = {
	entry: path.resolve(__dirname, 'src/todo.jsx'),
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)?$/,
				use: 'babel-loader',
			}
		]
	}
};
module.exports = config;
