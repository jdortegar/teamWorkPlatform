import { createSelector } from 'reselect';
import { map } from 'lodash';

import { getMessagesById } from './messages';

export const getBookmarkMessageIds = state => state.bookmarks.allMessageIds;
export const getBookmarksById = state => state.bookmarks.byId;

export const getBookmarks = createSelector(
  [getBookmarksById, getMessagesById],
  (bookmarksById = {}, messages = {}) => map(bookmarksById, ({ messageId }) => messages[messageId])
);

export const isBookmarked = createSelector(
  [getBookmarkMessageIds, (state, messageId) => messageId],
  (messageIds = [], messageId) => messageIds.includes(messageId)
);
