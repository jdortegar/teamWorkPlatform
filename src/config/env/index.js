import * as dev from './development';

const config = {
  hablaApiBaseUri: process.env.HABLAAPI_BASE_URI || dev.hablaApiBaseUri
}

const configLocal = {
  hablaApiBaseUri: 'http://localhost:8080'
}

export default config;
