export const CONVERSATIONS_RECEIVE = 'conversations/receive';

export const receiveConversations = (conversations) => {
  return {
    type: CONVERSATIONS_RECEIVE,
    payload: { conversations }
  };
};
