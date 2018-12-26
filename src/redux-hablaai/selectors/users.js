import { createSelector } from 'reselect';
import { getUserByUserId, getTranscriptByConversationId } from './state';
import { getCurrentUserId } from './auth';
import { getOrgTeams } from './teams';

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

export const getUserById = createSelector(
  [getUserByUserId, (state, userId) => userId],
  (usersByUserId, userId) => usersByUserId[userId]
);

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

export const getUserRoles = createSelector(
  [getCurrentUser, getOrgTeams],
  (currentUser, teams) => {
    const userRoles = {};
    userRoles.teamOwner = teams.filter(team => team.teamAdmin === currentUser.userId).map(team => team.teamId);
    if (currentUser && currentUser.role === 'admin') {
      userRoles.admin = true;
    }
    return userRoles;
  }
);
