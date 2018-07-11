import messaging from '../messaging';

export const TYPING_RECEIVE = 'typing/receive';

export const receiveTyping = ({ userId, conversationId, isTyping }) => {
  return {
    type: TYPING_RECEIVE,
    payload: { userId, conversationId, isTyping }
  };
};

/**
 * @param conversationId
 * @param typing True if the user is typing in the specified conversation, or false if the user is not.
 * Typically, this is some amount of time (ex. 15 seconds) after the last key press.
 */
export const iAmTyping = (conversationId, typing) => {
  // eslint-disable-next-line no-unused-vars
  return dispatch => {
    messaging().typing(conversationId, typing);
  };
};
