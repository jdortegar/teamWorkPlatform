import config from 'src/config/env';

// eslint-disable-next-line import/prefer-default-export
export const buildApiUrl = (endpoint, version = 'v1') => `${config.apiRoot}/${version}/${endpoint}`;
