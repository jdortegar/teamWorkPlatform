import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const MESSAGES_FETCH_SUCCESS = 'messages/fetch/success';

export const fetchMessages = conversationId => dispatch => {
  const requestUrl = buildApiUrl(`conversations/getTranscript/${conversationId}`);
  const thunk = dispatch(
    doAuthenticatedRequest(
      {
        requestUrl,
        method: 'get'
      },
      { conversationId }
    )
  );

  thunk.then(response => {
    if (response.data && response.data !== RESPONSE_STALE) {
      const { messages } = response.data;
      dispatch({
        type: MESSAGES_FETCH_SUCCESS,
        payload: { messages, conversationId }
      });
      return messages;
    }
    return response;
  });

  return thunk;
};
