import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import { getUserByUserId, getTranscriptByConversationId } from './state';
import { getCurrentUserId } from './index';

export { getUserByUserId, getPresencesByUserId } from './state';

export const getCurrentUser = createSelector(
  [getUserByUserId, getCurrentUserId],
  (userByUserId, currentUserId) => userByUserId[currentUserId]
);

export const getUserById = createCachedSelector(
  [getUserByUserId, (state, userId) => userId],
  (usersByUserId, userId) => usersByUserId[userId]
)((state, userId) => userId);

export const getResolvedBookmarks = createSelector(
  [getCurrentUser, getTranscriptByConversationId],
  (currentUser, transcriptByConversationId) => {
    const bookmarks = currentUser.bookmarks;
    bookmarks.messages = {};
    Object.keys(bookmarks).forEach(subscriberOrgId => {
      const messageIds = bookmarks[subscriberOrgId].messageIds;
      Object.keys(messageIds).forEach(messageId => {
        const bookmark = messageIds[messageId];
        const { conversationId } = bookmark;
        bookmarks.messages[messageId] = transcriptByConversationId[conversationId].messages[messageId];

        const prevSiblingId = bookmarks.prevSiblingId;
        if (prevSiblingId) {
          bookmarks.messages[prevSiblingId] = transcriptByConversationId[conversationId].messages[prevSiblingId];
        }
      });
    });

    return bookmarks;
  }
);
