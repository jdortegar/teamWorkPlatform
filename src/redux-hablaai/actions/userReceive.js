export const USER_RECEIVE = 'user/receive';
export const USER_RECEIVE_MYSELF = 'user/receive/myself';

export const receiveUser = (user) => {
  return {
    type: USER_RECEIVE,
    payload: { user }
  };
};

export const receiveUserMyself = (user) => {
  return {
    type: USER_RECEIVE_MYSELF,
    payload: { user }
  };
};
