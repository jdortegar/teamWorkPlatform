const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('./webpack.config.js');

config.devtool = 'source-map';
config.entry = ['./src/index.js'];
config.output.pathinfo = false;
config.output.filename = '[name].[chunkhash].js';
config.output.publicPath = '/';

config.plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
      HABLAAPI_BASE_URI: JSON.stringify(process.env.HABLAAPI_BASE_URI)
    }
  }),
  new HtmlWebpackPlugin({
    favicon: './src/favicon.ico',
    template: './src/index.html',
    inject: true
  }),
  new ExtractTextPlugin('styles.css'),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks(module) {
      return ((module.context && module.context.indexOf('node_modules')) !== -1);
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest'
  }),
  new CopyWebpackPlugin([{ from: './resources' }])
];

config.module.rules = [{
  test: /\.js$/,
  exclude: /(node_modules)/,
  use: [
    { loader: 'babel-loader' }
  ]
}, {
  test: /\.css$/,
  use: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: 'css-loader'
  })
}, {
  test: /\.(woff|woff2|eot|ttf|otf|jpg|png|svg|mp3)$/,
  exclude: /(node_modules)/,
  use: ['file-loader']
}];

module.exports = config;
