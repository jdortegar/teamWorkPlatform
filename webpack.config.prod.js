const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
    },
    minimizer: [
      new TerserPlugin({
        parallel: true
      }),
      new OptimizeCSSAssetsPlugin()
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        HABLAAPI_BASE_URI: JSON.stringify(process.env.HABLAAPI_BASE_URI),
        HABLAAPI_ENV: JSON.stringify(process.env.HABLAAPI_ENV),
        HABLAAPI_KNOWLEDGE_URI: JSON.stringify(process.env.HABLAAPI_KNOWLEDGE_URI),
        STRIPE: JSON.stringify(process.env.STRIPE),
        PUBLIC_WEBSITE_URL: JSON.stringify(process.env.PUBLIC_WEBSITE_URL)
      }
    }),
    new HtmlWebpackPlugin({
      favicon: './src/favicon.ico',
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new CopyWebpackPlugin([{ from: './resources' }])
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: [{ loader: 'babel-loader' }]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|jpg|png|svg|mp3)$/,
        use: ['file-loader']
      }
    ]
  },
  resolve: config.resolve
};
