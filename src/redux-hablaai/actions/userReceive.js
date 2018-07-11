export const USER_RECEIVE = 'user/receive';

export const receiveUser = user => {
  return {
    type: USER_RECEIVE,
    payload: { user }
  };
};
