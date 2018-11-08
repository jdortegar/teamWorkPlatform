require('babel-polyfill');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const express = require('express');
const Helmet = require('helmet');
const fs = require('fs');
const config = require('./webpack.config');

const mobileAppleAppId = process.env.MOBILE_APPLE_APP_ID || '1223813655';
let indexPageBeginHeadStart;
let indexPageAfterHeadStart;

// <meta name="apple-itunes-app" content="app-id=1223813655, affiliate-data=myAffiliateData, app-argument=/login">
function compileIndexPage(requestUrl) {
  if (indexPageBeginHeadStart && indexPageAfterHeadStart) {
    return `${indexPageBeginHeadStart}  <meta name="apple-itunes-app" content="app-id=${mobileAppleAppId}, affiliate-data=myAffiliateData, app-argument=${requestUrl}">\n  <link rel="manifest" href="/manifest.json">\n${indexPageAfterHeadStart}`;
  }

  let buf = '';
  fs.readFileSync(`${__dirname}/dist/index.html`)
    .toString()
    .split('\n')
    .forEach(line => {
      buf += `${line}\n`;
      if (line === '<head>') {
        indexPageBeginHeadStart = buf;
        buf = '';
      }
    });
  indexPageAfterHeadStart = buf;
  return compileIndexPage(requestUrl);
}

let server;

if (process.env.NODE_ENV !== 'production') {
  server = new WebpackDevServer(webpack(config), {
    contentBase: './resources',
    publicPath: config.output.publicPath,
    hot: false,
    historyApiFallback: { disableDotRule: true },
    disableHostCheck: true,
    before(app) {
      // File content-type defaults to application/octet-stream, but needs to be application/json.
      app.get('/.well-known/apple-app-site-association', (req, res, next) => {
        res.set({ 'Content-Type': 'application/json' });
        next();
      });
    }
  });
} else {
  server = express();

  server.set('trust proxy', 1); // Allow http proxying.
  server.use(new Helmet()); // Add secure HTTP headers.

  // File content-type defaults to application/octet-stream, but needs to be application/json.
  server.get('/.well-known/apple-app-site-association', (req, res, next) => {
    res.set({ 'Content-Type': 'application/json' });
    next();
  });

  server.use(express.static('dist', { fallthrough: true }));
  server.use('/', (req, res) => {
    res.send(compileIndexPage(req.originalUrl));
  });
}

const nodePort = process.env.NODE_PORT || 9090;
server.listen(nodePort, err => {
  if (err) {
    // console.error(err);
  }

  console.log(`Listening at ${nodePort}`);
});
