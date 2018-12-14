const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('./webpack.config.js');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    pathinfo: false,
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js',
    publicPath: '/'
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        HABLAAPI_BASE_URI: JSON.stringify(process.env.HABLAAPI_BASE_URI),
        HABLAAPI_ENV: JSON.stringify(process.env.HABLAAPI_ENV),
        HABLAAPI_KNOWLEDGE_URI: JSON.stringify(process.env.HABLAAPI_KNOWLEDGE_URI)
      }
    }),
    new HtmlWebpackPlugin({
      favicon: './src/favicon.ico',
      template: './src/index.html'
    }),
    new CopyWebpackPlugin([{ from: './resources' }])
  ],
  module: config.module,
  resolve: config.resolve
};
