/* eslint-disable no-console */
const express = require('express');
const Helmet = require('helmet');

if (process.env.NODE_ENV === 'production') {
  const server = express();

  server.set('trust proxy', 1); // Allow http proxying.
  server.use(new Helmet()); // Add secure HTTP headers.

  // File content-type defaults to application/octet-stream, but needs to be application/json.
  server.get('/.well-known/apple-app-site-association', (req, res, next) => {
    res.set({ 'Content-Type': 'application/json' });
    next();
  });

  server.use(express.static('dist', { fallthrough: true }));
  server.use('/', (req, res) => {
    return res.sendFile(`${__dirname}/dist/index.html`);
  });

  const nodePort = process.env.NODE_PORT || 9090;

  server.listen(nodePort, err => {
    if (err) {
      console.error('Express error:', err);
    }

    console.log(`Listening at ${nodePort}`);
  });
}
