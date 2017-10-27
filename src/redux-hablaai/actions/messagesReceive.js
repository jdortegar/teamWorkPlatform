export const MESSAGES_RECEIVE = 'messages/receive';

export const receiveMessages = (messages, conversationId) => {
  return {
    type: MESSAGES_RECEIVE,
    payload: { messages, conversationId }
  };
};
