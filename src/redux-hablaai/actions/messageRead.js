import config from 'config/env';
import { doAuthenticatedRequest } from './urlRequest';

export const readMessage = (messageId, conversationId) => { // eslint-disable-line import/prefer-default-export
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/conversations/${conversationId}/readMessage`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { messageId, conversationId };

  return doAuthenticatedRequest({
    requestUrl,
    method: 'post',
    data: { messageId, conversationId }
  }, reduxState);
};
