import { getCurrentUserId } from 'src/selectors';
import { chatMessaging } from '../messaging';

export const TYPING_RECEIVE = 'typing/receive';

export const receiveTyping = ({ userId, conversationId, isTyping }) => ({
  type: TYPING_RECEIVE,
  payload: { userId, conversationId, isTyping }
});

/**
 * @param conversationId
 * @param isTyping True if the user is typing in the specified conversation, or false if the user is not.
 * Typically, this is some amount of time (ex. 5 seconds) after the last key press.
 */
export const sendTyping = (conversationId, isTyping) => (dispatch, getState) => {
  const userId = getCurrentUserId(getState());
  chatMessaging().sendTyping({ conversationId, userId, isTyping });
};
