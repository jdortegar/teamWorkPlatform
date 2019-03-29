import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const CONVERSATION_DIRECT_RECEIVE = 'conversations/direct/receive';

export const createConversation = conversationData => dispatch => {
  const requestUrl = buildApiUrl(`conversations`, 'v2');

  const thunk = dispatch(
    doAuthenticatedRequest(
      {
        requestUrl,
        method: 'post',
        data: conversationData
      },
      { ...conversationData }
    )
  );

  thunk.then(response => {
    if (response.data && response.data !== RESPONSE_STALE) {
      const { data } = response;
      dispatch({
        type: CONVERSATION_DIRECT_RECEIVE,
        payload: { conversation: data }
      });
    }
    return response;
  });

  return thunk;
};
