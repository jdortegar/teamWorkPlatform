export const CONVERSATIONS_RECEIVE = 'conversations/receive';

export const receiveConversations = conversations => ({
  type: CONVERSATIONS_RECEIVE,
  payload: { conversations }
});
