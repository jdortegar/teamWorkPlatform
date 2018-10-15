import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest } from './urlRequest';

// eslint-disable-next-line import/prefer-default-export
export const deleteMessage = (messageId, conversationId) => {
  const requestUrl = buildApiUrl(`conversations/${conversationId}/deleteMessage/${messageId}`);

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
