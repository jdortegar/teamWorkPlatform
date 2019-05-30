import { getCurrentUserId } from 'src/selectors';

export const MESSAGE_RECEIVE = 'message/receive';
export const MESSAGE_DELETED = 'message/deleted';
export const MESSAGE_SCHEDULE_RECEIVED = 'message/schedule/received';

export const receiveMessage = message => (dispatch, getState) => {
  const currentUserId = getCurrentUserId(getState());

  if (message.appData.type && message.appData.type === 'scheduleMessage') {
    dispatch({
      type: MESSAGE_SCHEDULE_RECEIVED,
      payload: { message }
    });
  }

  return dispatch({
    type: MESSAGE_RECEIVE,
    payload: { message, currentUserId }
  });
};

export const receiveMessageDeleted = message => ({
  type: MESSAGE_DELETED,
  payload: { message }
});
