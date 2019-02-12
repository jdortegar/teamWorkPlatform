import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const CONVERSATION_CREATE_SUCCESS = 'conversations/create/success';

export const createConversation = conversationData => dispatch => {
  const requestUrl = buildApiUrl(`conversations`, 'v2');

  const thunk = dispatch(
    doAuthenticatedRequest({
      requestUrl,
      method: 'post',
      data: conversationData
    })
  );

  thunk.then(response => {
    if (response.data && response.data !== RESPONSE_STALE) {
      const { data } = response;
      dispatch({
        type: CONVERSATION_CREATE_SUCCESS,
        payload: { ...data }
      });
    }
    return response;
  });

  return thunk;
};
