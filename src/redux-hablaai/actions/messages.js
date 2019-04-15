import { buildChatUrl } from 'src/lib/api';
import { doAuthenticatedRequest } from './urlRequest';

export const MESSAGES_FETCH_SUCCESS = 'messages/fetch/success';
export const MESSAGES_FETCH_FAILURE = 'messages/fetch/failure';

export const fetchMessages = conversationId => async dispatch => {
  const requestUrl = buildChatUrl(`conversations/${conversationId}/messages`);

  try {
    const { data = {} } = await dispatch(doAuthenticatedRequest({ requestUrl, method: 'get' }));
    const { items: messages, pagination } = data;
    dispatch({ type: MESSAGES_FETCH_SUCCESS, payload: { messages, pagination, conversationId } });
    return messages;
  } catch (e) {
    const error = e.response ? { ...e.response.data } : e;
    dispatch({ type: MESSAGES_FETCH_FAILURE, payload: { error } });
    return error;
  }
};
