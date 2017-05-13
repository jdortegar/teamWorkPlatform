//This config file is use for webpack build for production
var webpack = require('webpack'); 
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin'); //auto config <script src> for index.html base on js in dist folder
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var combineLoaders = require('webpack-combine-loaders');


//use = loader, rules=loaders   old -> new

const VENDORS = [	//code which has long time update (stable code) => improve download speed
	'axios', 'body-parser',
	'react', 'react-bootstrap', 'react-bootstrap-timezone-picker', 
	'react-country-region-selector', 'react-dom', 'react-graph-vis',
	'react-redux', 'react-router', 'react-router-bootstrap',
	'redux-form'
];

const config = {
	entry: {
		bundle: './src/index.js',
		vendor: VENDORS
	},
	output: {
		path: path.join(__dirname, 'dist'),	//Create hash add to file name, help browser easily regconize file changed
		filename: '[name].[chunkhash].js',	//Code spliting : bundle.js and vendor.js => reduce size of bundle.js
		publicPath: '/'            	//PRODUCTION: use for url-loader to lookup big images
	},
	module: {
	loaders: [
			{
				exclude: /node_modules/,	//exclude babel-loader in this folder
				loader: 'babel-loader',     //tell babel how to work with webpack
				test: /\.js$/,              //regex, all files .js will be applied by babel-loader
				query: {
					presets: ['react', 'es2015', 'stage-1']
				}
			},
			// {
			// 	test: /\.css$/,
			// 	loader: ExtractTextPlugin('style-loader')
			// },	
			// {
			// 		test: /\.css$/,
			// 		loader: 'css-loader',
			// 		query: {
			// 			modules: true,
			// 			loacalIdentName: '[name]__[local]--[hash:base64:5'
			// 		}
			// },
			{
				use: ['style-loader', 'css-loader'], //apply loader from right to left
				test: /\.css$/
			},
			{
				test: /\.(jpg|jpeg|png|gif|svg|eot|ttf|woff|woff2|otf)$/, //effect on jpg, jpeg, png, gif, svg
				loader: [	
					{								//apply bottom to top
						loader: 'url-loader',		//if image size is small, put into bundle.js, else put in output folder
						options: {limit: 50000}		//limit to 50KB
					},		
					'image-webpack-loader'			//compress the image
				]
			}
			
		]
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({	//vendor.js contain vendor code only, bundle.js doesn't
			names: ['vendor', 'manifest']			//put in vendor.js, helps browser caching easily
		}),
		new HtmlWebpackPlugin({
			template: 'src/index.html'  	//file that plugin will effect
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
		})
	]

};
module.exports = config;
