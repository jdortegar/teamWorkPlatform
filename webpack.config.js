const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let nodeUrl = process.env.NODE_URL;
if (!nodeUrl) {
  const nodePort = process.env.NODE_PORT || 9090;
  nodeUrl = 'localhost';
  if (nodePort === 80) {
    nodeUrl = `http://${nodeUrl}`;
  } else if (nodePort === 443) {
    nodeUrl = `https://${nodeUrl}`;
  } else {
    nodeUrl = `http://${nodeUrl}:${nodePort}`;
    nodeUrl.nodeUrl = `http://${nodeUrl}:${nodePort}`;
  }
}

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: './src/index.js',
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: `${nodeUrl}/`
  },
  devServer: {
    contentBase: path.join(__dirname, 'resources'),
    historyApiFallback: true,
    disableHostCheck: true,
    port: process.env.NODE_PORT || 9090,
    before(app) {
      // File content-type defaults to application/octet-stream, but needs to be application/json.
      app.get('/.well-known/apple-app-site-association', (req, res, next) => {
        res.set({ 'Content-Type': 'application/json' });
        next();
      });
    }
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      favicon: './src/favicon.ico',
      template: './src/index.html'
    })
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
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|jpg|png|svg|mp3)$/,
        use: ['file-loader']
      }
    ]
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src')
    },
    extensions: ['.js', '.jsx', '.json', '.css', '.scss', '.png', '.svg', '.jpg', '.gif']
  }
};
