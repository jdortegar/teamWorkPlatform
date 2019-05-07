import { createSelector } from 'reselect';

export const getUnreadMessagesByConversation = state => state.unreadMessages.byConversation;

export const getUnreadMessages = createSelector(
  [getUnreadMessagesByConversation, (state, conversationId) => conversationId],
  (unreadMessages = {}, conversationId) => unreadMessages[conversationId] || 0
);
