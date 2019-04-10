import config from 'src/config/env';

export const buildApiUrl = (endpoint, version = 'v1') => `${config.apiRoot}/${version}/${endpoint}`;
export const buildKnowledgeApiUrl = endpoint => `${config.knowledgeApiRoot}/${endpoint}`;
export const buildChatUrl = (endpoint, version = 'v1') => `${config.chatApiRoot}/${version}/${endpoint}`;
