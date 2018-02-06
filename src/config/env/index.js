import * as dev from './development';

const config = {
  hablaApiBaseUri: process.env.HABLAAPI_BASE_URI || dev.hablaApiBaseUri,
  hablaApiEnv: process.env.HABLAAPI_ENV || 'dev'
};

export default config;
