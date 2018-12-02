const webpack = require('webpack');
const path = require('path');
const buildPath = process.env.BUILD_PATH;
const environment = process.env.ENV;
const watch = JSON.parse(process.env.WATCH);
const sourcemaps = JSON.parse(process.env.SOURCEMAPS);
const uglify = JSON.parse(process.env.UGLIFY);

const plugins = [];
if (uglify) {
	plugins.push(new webpack.optimize.UglifyJsPlugin({ output: { comments: false }, minimize: true, warnings: true }));
}
if (environment === 'prod') {
	plugins.push(new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }));
}

let devtool = false;
if (sourcemaps) {
	devtool = 'cheap-eval-source-map';
}

module.exports = {
	entry: './src/js/app.js',
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader?presets[]=es2015'
			}
		]
	},
	output: {
		filename: 'wkny.min.js',
		path: path.resolve(__dirname, buildPath)
	},
	devtool: devtool,
	watch: watch,
	cache: watch,
	watchOptions: {
		aggregateTimeout: 300,
		poll: 1000,
		ignored: /node_modules/
	},
	plugins: plugins
}