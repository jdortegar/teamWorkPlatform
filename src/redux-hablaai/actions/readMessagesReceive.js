export const MESSAGES_READ_RECEIVE = 'messages/read/receive';

export const receiveReadMessages = readMessages => ({
  type: MESSAGES_READ_RECEIVE,
  payload: { readMessages }
});
