const appConfig = require('../webpack.config.js');

module.exports = (config, type) => {
  config.resolve.alias = appConfig.resolve.alias;
  config.module.rules = appConfig.module.rules;
  return config;
};
