import { buildChatUrl } from 'src/lib/api';
import { getCurrentUserId } from 'src/selectors';
import { doAuthenticatedRequest } from './urlRequest';

export const MESSAGES_READ_SUCCESS = 'messages/read/success';
export const MESSAGES_READ_FAILURE = 'messages/read/failure';

// eslint-disable-next-line import/prefer-default-export
export const readMessages = conversationId => async (dispatch, getState) => {
  const requestUrl = buildChatUrl(`conversations/${conversationId}/messages/readings`);
  const userId = getCurrentUserId(getState());

  try {
    const { data = {} } = await dispatch(
      doAuthenticatedRequest({ requestUrl, method: 'post', data: { userId } }, { conversationId, userId })
    );
    const { readings: messageIds } = data;

    dispatch({ type: MESSAGES_READ_SUCCESS, payload: { messageIds, conversationId, currentUserId: userId } });
    return messageIds;
  } catch (e) {
    const error = e.response ? { ...e.response.data } : e;
    dispatch({ type: MESSAGES_READ_FAILURE, payload: { error } });
    throw new Error(e);
  }
};
