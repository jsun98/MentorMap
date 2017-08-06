const path = require('path')

module.exports = {
	entry: { index: path.resolve(__dirname, 'src/index/javascript/index.js') },
	output: {
		path: path.resolve(__dirname, './build'),
		filename: '[name].js',
	},
	resolve: { extensions: [ '', '.js', '.es6' ] },
}
