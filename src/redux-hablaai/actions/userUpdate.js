import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const UPDATED_USER_STATUS_SUCCESS = 'updateUser/success';

export const updateUser = (updateObject, userId, options = { getKey: false, forceGet: false }) => {
  let requestUrl = buildApiUrl('users/updateUser');
  requestUrl = userId ? `${requestUrl}?userId=${userId}` : requestUrl;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { updateObject };

  return dispatch => {
    const thunk = dispatch(
      doAuthenticatedRequest(
        {
          requestUrl,
          method: 'patch',
          data: updateObject
        },
        reduxState,
        options
      )
    );

    if (!options.getKey) {
      thunk.then(response => {
        if (userId && response.status === 204 && response.data !== RESPONSE_STALE) {
          dispatch({
            type: UPDATED_USER_STATUS_SUCCESS,
            payload: { userId }
          });
        }
        return response;
      });
    }

    return thunk;
  };
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
  return updateUser({ bookmarks }, currentUser.userId);
};
