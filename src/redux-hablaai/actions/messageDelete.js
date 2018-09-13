import config from 'config/env';
import { doAuthenticatedRequest } from './urlRequest';

// eslint-disable-next-line import/prefer-default-export
export const deleteMessage = (messageId, conversationId) => {
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/conversations/${conversationId}/deleteMessage/${messageId}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { messageId };
  return doAuthenticatedRequest(
    {
      requestUrl,
      method: 'delete',
      data: messageId
    },
    reduxState
  );
};
