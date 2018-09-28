import * as dev from './development';
import pjson from '../../../package.json';

const config = {
  apiRoot: process.env.HABLAAPI_BASE_URI || dev.API_ROOT,
  hablaApiEnv: process.env.HABLAAPI_ENV || 'dev',
  hablaWebAppVersion: pjson.version
};
export default config;
