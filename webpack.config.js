const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

const nodePort = process.env.NODE_PORT || 8080;
let nodeUrl = 'localhost';
if (nodePort === 80) {
  nodeUrl = `http:// ${nodeUrl}`;
} else if (nodePort === 443) {
  nodeUrl = `https:// ${nodeUrl}`;
} else {
  nodeUrl = `http://${nodeUrl}:${nodePort}`;
}

module.exports = {
  devtool: 'eval-source-map',
  entry: [
    'react-hot-loader/patch',
    `webpack-dev-server/client?${nodeUrl}`,
    'webpack/hot/only-dev-server',
    './src/index.js'
  ],
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: `${nodeUrl}/`
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: './src/favicon.ico',
      template: './src/index.html',
      inject: true
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /(node_modules)/,
      use: [
        { loader: 'babel-loader' }
      ]
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: ['file-loader']
    }]
  },
  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      'node_modules'
    ],
    extensions: ['.js', '.jsx', '.json', '.css', '.scss', '.png', '.svg', '.jpg', '.gif']
  }
};
