export const USER_RECEIVE = 'user/receive';

export const receiveUser = user => ({
  type: USER_RECEIVE,
  payload: { user }
});
