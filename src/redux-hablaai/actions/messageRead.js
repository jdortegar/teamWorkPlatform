import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest } from './urlRequest';

// eslint-disable-next-line import/prefer-default-export
export const readMessage = (messageId, conversationId) => {
  const requestUrl = buildApiUrl(`conversations/${conversationId}/readMessage`);

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { messageId, conversationId };

  return doAuthenticatedRequest(
    {
      requestUrl,
      method: 'post',
      data: { messageId, conversationId }
    },
    reduxState
  );
};
