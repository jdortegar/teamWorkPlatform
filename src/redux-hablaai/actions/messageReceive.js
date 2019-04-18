export const MESSAGE_RECEIVE = 'message/receive';

export const receiveMessage = (message, conversationId) => ({
  type: MESSAGE_RECEIVE,
  payload: { message, conversationId }
});
