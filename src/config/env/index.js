import * as dev from './development';

const config = {
  hablaApiBaseUri: process.env.HABLAAPI_BASE_URI || dev.hablaApiBaseUri
};

console.log(config);

export default config;
