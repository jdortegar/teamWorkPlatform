import { createSelector } from 'reselect';
import { map, find } from 'lodash';

import { getMessagesById } from './messages';

export const getBookmarkMessageIds = state => state.bookmarks.allMessageIds;
export const getBookmarksById = state => state.bookmarks.byId;

export const getBookmarks = createSelector(
  [getBookmarksById, getMessagesById],
  (bookmarksById = {}, messages = {}) => map(bookmarksById, ({ messageId }) => messages[messageId])
);

export const getBookmarkByMessageId = createSelector(
  [getBookmarksById, (state, messageId) => messageId],
  (bookmarksById = {}, messageId) => find(bookmarksById, { messageId })
);

export const isBookmarked = createSelector(
  [getBookmarkMessageIds, (state, messageId) => messageId],
  (messageIds = [], messageId) => messageIds.includes(messageId)
);
