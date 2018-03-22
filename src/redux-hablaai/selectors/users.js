import { createSelector } from 'reselect';
import {
  getUserByUserId,
  getMyselfUserId,
  getTranscriptByConversationId
} from './state';

export {
  getUserByUserId,
  getMyselfUserId,
  getPresencesByUserId
} from './state';

export const getCurrentUser = createSelector(
  [getUserByUserId, getMyselfUserId],
  (userByUserId, myselfUserId) => {
    return userByUserId[myselfUserId];
  }
);

export const getResolvedBookmarks = createSelector(
  [getCurrentUser, getTranscriptByConversationId],
  (currentUser, transcriptByConversationId) => {
    const bookmarks = currentUser.bookmarks;
    bookmarks.messages = {};
    Object.keys(bookmarks).forEach((subscriberOrgId) => {
      const messageIds = bookmarks[subscriberOrgId].messageIds;
      Object.keys(messageIds).forEach((messageId) => {
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
