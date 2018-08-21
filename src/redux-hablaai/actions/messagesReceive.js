export const MESSAGES_RECEIVE = 'messages/receive';

export const receiveMessages = (messages, conversationId) => ({
  type: MESSAGES_RECEIVE,
  payload: { messages, conversationId }
});
