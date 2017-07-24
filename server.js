require('babel-polyfill');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const express = require('express');
const Helmet = require('helmet');

let server;

if (process.env.NODE_ENV !== 'production') {
  server = new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: { disableDotRule: true }
  });
} else {
  server = express();

  server.set('trust proxy', 1); // Allow http proxying.
  server.use(new Helmet()); // Add secure HTTP headers.

  server.use(express.static('dist', { fallthrough: true }));
  server.use('/', (req, res) => {
    res.sendFile(`${__dirname}/dist/index.html`);
  });
}

const nodePort = process.env.NODE_PORT || 8080;
server.listen(nodePort, 'localhost', (err) => {
  if (err) {
    // console.error(err);
  }
  // console.log(`Listening at localhost:${nodePort}`);
});
