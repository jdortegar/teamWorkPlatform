import { getCurrentUserId } from 'src/selectors';

export const MESSAGE_RECEIVE = 'message/receive';

export const receiveMessage = (message, conversationId) => (dispatch, getState) => {
  const currentUserId = getCurrentUserId(getState());

  return dispatch({
    type: MESSAGE_RECEIVE,
    payload: { message, conversationId, currentUserId }
  });
};
