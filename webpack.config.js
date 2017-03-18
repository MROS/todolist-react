var path = require('path');
var config = {
	entry: path.resolve(__dirname, 'todo.jsx'),
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: 'babel-loader'
			}
		]
	}
};
module.exports = config;
