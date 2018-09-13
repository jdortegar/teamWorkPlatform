import * as dev from './development';
import pjson from '../../../package.json';

const config = {
  hablaApiBaseUri: process.env.HABLAAPI_BASE_URI || dev.hablaApiBaseUri,
  hablaApiEnv: process.env.HABLAAPI_ENV || 'dev',
  hablaWebAppVersion: pjson.version
};
export default config;
