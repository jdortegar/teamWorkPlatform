import * as dev from './development';

const config = {
  hablaApiBaseUri: process.env.HABLAAPI_BASE_URI || dev.hablaApiBaseUri
};

export default config;

