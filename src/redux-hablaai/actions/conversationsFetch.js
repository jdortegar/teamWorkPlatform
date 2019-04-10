import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const OLD_CONVERSATIONS_FETCH_SUCCESS = 'conversations/fetch/success';

export const oldFetchConversations = (teamId = undefined) => dispatch => {
  const thunk = dispatch(
    doAuthenticatedRequest(
      {
        requestUrl: buildApiUrl(`conversations/getConversations?teamId=${teamId}`),
        method: 'get'
      },
      { teamId }
    )
  );

  thunk.then(response => {
    if (response.data && response.data !== RESPONSE_STALE) {
      const { conversations } = response.data;
      dispatch({
        type: OLD_CONVERSATIONS_FETCH_SUCCESS,
        payload: { conversations }
      });
      return conversations;
    }
    return response;
  });

  return thunk;
};
