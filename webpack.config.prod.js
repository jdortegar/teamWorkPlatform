const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./webpack.config.js');

config.devtool = 'source-map';
config.entry = ['./src/index.js'];
config.output.pathinfo = false;
config.output.filename = '[name].[chunkhash].js';
config.output.publicPath = '/';

const extractSCSSModules = new ExtractTextPlugin({
  filename: 'styles.css',
  disable: false,
  allChunks: true
});

const extractSCSSGlobals = new ExtractTextPlugin({
  filename: 'global-styles.css',
  disable: false,
  allChunks: true
});

const extractCSSLibs = new ExtractTextPlugin({
  filename: 'libraries.css',
  disable: false,
  allChunks: true
});

config.plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    },
  }),
  new HtmlWebpackPlugin({
    favicon: './src/favicon.ico',
    template: './src/index.html',
    inject: true
  }),
  extractSCSSGlobals,
  extractSCSSModules,
  extractCSSLibs,
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: function(module) {
      return ((module.context && module.context.indexOf('node_modules')) !== -1);
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest'
  })
];

config.module.rules = [{
  test: /\.js$/,
  exclude: /(node_modules)/,
  use: [
    { loader: 'babel-loader' }
  ]
}, {
  test: /\.css$/,
  use: ['style-loader', 'css-loader']
}, {
  test: /\.(png|svg|jpg|gif)$/,
  exclude: /(node_modules)/,
  use: [{
    loader: 'url-loader?name=images/[name].[ext]&limit=8192'
  }]
}, {
  test: /\.(woff|woff2|eot|ttf|otf)$/,
  use: ['file-loader']
}];

module.exports = config;
