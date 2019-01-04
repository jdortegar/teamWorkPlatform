import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const TRANSCRIPT_FETCH_SUCCESS = 'transcript/fetch/success';

export const fetchTranscript = conversationId => dispatch => {
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
        type: TRANSCRIPT_FETCH_SUCCESS,
        payload: { messages, conversationId }
      });
      return messages;
    }
    return response;
  });

  return thunk;
};
