const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
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
  new UglifyJsPlugin({
    uglifyOptions: {
      output: {
        keep_quoted_props: true
      }
    }
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
      HABLAAPI_BASE_URI: JSON.stringify(process.env.HABLAAPI_BASE_URI),
      HABLAAPI_ENV: JSON.stringify(process.env.HABLAAPI_ENV),
      HABLAAPI_KNOWLEDGE_URI: JSON.stringify(process.env.HABLAAPI_KNOWLEDGE_URI)
    }
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
    minChunks(module) {
      return (module.context && module.context.indexOf('node_modules')) !== -1;
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest'
  }),
  new CopyWebpackPlugin([{ from: './resources' }])
];

config.module.rules = [
  {
    test: /\.js$/,
    exclude: /(node_modules)/,
    use: [{ loader: 'babel-loader' }]
  },
  {
    test: /\.css$/,
    use: ['style-loader', 'css-loader']
  },
  {
    test: /\.(woff|woff2|eot|ttf|otf|jpg|png|svg|mp3)$/,
    exclude: /(node_modules)/,
    use: ['file-loader']
  }
];

module.exports = config;
