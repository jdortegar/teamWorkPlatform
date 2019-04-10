import { buildChatUrl } from 'src/lib/api';
import { getCurrentUserId } from 'src/selectors';
import { doAuthenticatedRequest } from './urlRequest';

export const CONVERSATIONS_FETCH_SUCCESS = 'conversations/fetch/success';

export const fetchConversations = () => (dispatch, getState) => {
  const currentUserId = getCurrentUserId(getState());
  const requestUrl = buildChatUrl(`conversations?userId=${currentUserId}`);

  return dispatch(
    doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    })
  );
};
