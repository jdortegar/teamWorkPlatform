import config from 'src/config/env';
import { doAuthenticatedRequest } from './urlRequest';

// eslint-disable-next-line import/prefer-default-export
export const createMessage = (message, conversationId) => {
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/conversations/${conversationId}/createMessage`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { message, conversationId };

  return doAuthenticatedRequest(
    {
      requestUrl,
      method: 'post',
      data: message
    },
    reduxState
  );
};
