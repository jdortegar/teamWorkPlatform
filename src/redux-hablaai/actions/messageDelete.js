import config from '../config';
import { doAuthenticatedRequest } from './urlRequest';

export const deleteMessage = (messageId, conversationId) => { // eslint-disable-line import/prefer-default-export
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/conversations/${conversationId}/deleteMessage/${messageId}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { messageId };
  return doAuthenticatedRequest({
    requestUrl,
    method: 'delete',
    data: messageId
  }, reduxState);
};
