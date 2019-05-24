import { getCurrentUserId } from 'src/selectors';

export const MESSAGE_RECEIVE = 'message/receive';
export const MESSAGE_DELETED = 'message/deleted';

export const receiveMessage = message => (dispatch, getState) => {
  const currentUserId = getCurrentUserId(getState());

  return dispatch({
    type: MESSAGE_RECEIVE,
    payload: { message, currentUserId }
  });
};

export const receiveMessageDeleted = message => ({
  type: MESSAGE_DELETED,
  payload: { message }
});
