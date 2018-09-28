import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest } from './urlRequest';

export const updateUser = (updateObject, getKey = false) => {
  const requestUrl = buildApiUrl('users/updateUser');

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { updateObject };

  return doAuthenticatedRequest(
    {
      requestUrl,
      method: 'patch',
      data: updateObject
    },
    reduxState,
    getKey
  );
};

export const saveBookmark = (currentUser, subscriberOrgId, message, setBookmark) => {
  const bookmarks = { ...currentUser.bookmarks };
  const orgBookmarks = bookmarks[subscriberOrgId] || { messageIds: {} };
  if (setBookmark) {
    orgBookmarks.messageIds[message.messageId] = message;
  } else {
    delete orgBookmarks.messageIds[message.messageId];
  }
  bookmarks[subscriberOrgId] = orgBookmarks;
  return updateUser({ bookmarks });
};
