import * as dev from './development';
import pjson from '../../../package.json';

const config = {
  apiRoot: process.env.HABLAAPI_BASE_URI || dev.API_ROOT,
  knowledgeApiRoot: process.env.HABLAAPI_KNOWLEDGE_URI || dev.KNOWLEDGE_API_ROOT,
  chatApiRoot: process.env.HABLAAPI_CHAT_URI || dev.CHAT_API_ROOT,
  hablaApiEnv: process.env.HABLAAPI_ENV || 'dev',
  hablaWebAppVersion: pjson.version,
  stripe: process.env.STRIPE || dev.STRIPE,
  publicWebsiteUrl: process.env.PUBLIC_WEBSITE_URL || dev.PUBLIC_WEBSITE_URL
};
export default config;
