import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const UPDATED_USER_STATUS_SUCCESS = 'updateUser/success';

export const updateUser = (updateObject, userId) => dispatch => {
  let requestUrl = buildApiUrl('users/updateUser');
  requestUrl = userId ? `${requestUrl}?userId=${userId}` : requestUrl;

  const thunk = dispatch(
    doAuthenticatedRequest(
      {
        requestUrl,
        method: 'patch',
        data: updateObject
      },
      { updateObject }
    )
  );

  thunk.then(response => {
    if (response.data && response.data !== RESPONSE_STALE) {
      const userUpdated = response.data;
      dispatch({
        type: UPDATED_USER_STATUS_SUCCESS,
        payload: { userUpdated }
      });
    }
    return response;
  });

  return thunk;
};

export const saveBookmark = (currentUser, subscriberOrgId, message, setBookmark) => {
  const bookmarks = { ...currentUser.bookmarks };
  const orgBookmarks = bookmarks[subscriberOrgId] || { messageIds: {} };
  if (setBookmark) {
    orgBookmarks.messageIds[message.id] = message;
  } else {
    delete orgBookmarks.messageIds[message.id];
  }
  bookmarks[subscriberOrgId] = orgBookmarks;
  return updateUser({ bookmarks }, currentUser.userId);
};
