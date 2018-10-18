import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import { getUserByUserId, getTranscriptByConversationId } from './state';
import { getCurrentUserId } from './auth';

export { getUserByUserId, getPresencesByUserId } from './state';

export const getCurrentUser = createSelector(
  [getUserByUserId, getCurrentUserId],
  (userByUserId, currentUserId) => userByUserId[currentUserId]
);

export const getUserFullName = createSelector(
  [getUserByUserId, (state, userId) => userId],
  (usersByUserId, userId) => (usersByUserId[userId] ? usersByUserId[userId].fullName : '')
);

export const getCurrentUserFirstName = createSelector(
  getCurrentUser,
  currentUser => (currentUser ? currentUser.firstName : '')
);

export const getUserById = createCachedSelector(
  [getUserByUserId, (state, userId) => userId],
  (usersByUserId, userId) => usersByUserId[userId]
)((state, userId) => userId);

export const getResolvedBookmarks = createSelector(
  [getCurrentUser, getTranscriptByConversationId],
  (currentUser, transcriptByConversationId) => {
    const { bookmarks } = currentUser;
    bookmarks.messages = {};
    Object.keys(bookmarks).forEach(subscriberOrgId => {
      const { messageIds } = bookmarks[subscriberOrgId];
      Object.keys(messageIds).forEach(messageId => {
        const bookmark = messageIds[messageId];
        const { conversationId } = bookmark;
        bookmarks.messages[messageId] = transcriptByConversationId[conversationId].messages[messageId];

        const { prevSiblingId } = bookmarks;
        if (prevSiblingId) {
          bookmarks.messages[prevSiblingId] = transcriptByConversationId[conversationId].messages[prevSiblingId];
        }
      });
    });

    return bookmarks;
  }
);
