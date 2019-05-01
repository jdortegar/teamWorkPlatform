import { buildChatUrl } from 'src/lib/api';
import { getCurrentUserId } from 'src/selectors';
import { doAuthenticatedRequest } from './urlRequest';

export const BOOKMARKS_FETCH_SUCCESS = 'bookmarks/fetch/success';
export const BOOKMARKS_FETCH_FAILURE = 'bookmarks/fetch/failure';
export const BOOKMARK_CREATE_SUCCESS = 'bookmarks/create/success';
export const BOOKMARK_CREATE_FAILURE = 'bookmarks/create/failure';

export const fetchBookmarks = () => async (dispatch, getState) => {
  const userId = getCurrentUserId(getState());
  const requestUrl = buildChatUrl(`users/${userId}/bookmarks`);

  try {
    const { data: bookmarks } = await dispatch(doAuthenticatedRequest({ requestUrl, method: 'get' }));
    dispatch({ type: BOOKMARKS_FETCH_SUCCESS, payload: { bookmarks } });
    return bookmarks;
  } catch (e) {
    const error = e.response ? { ...e.response.data } : e;
    dispatch({ type: BOOKMARKS_FETCH_FAILURE, payload: { error } });
    throw new Error(e);
  }
};

export const bookmarkMessage = messageId => async (dispatch, getState) => {
  const requestUrl = buildChatUrl('bookmarks');
  const userId = getCurrentUserId(getState());
  const data = { messageId, userId };

  try {
    const { data: bookmark } = await dispatch(doAuthenticatedRequest({ requestUrl, method: 'post', data }, data));
    dispatch({ type: BOOKMARK_CREATE_SUCCESS, payload: { bookmark } });
    return bookmark;
  } catch (e) {
    const error = e.response ? { ...e.response.data } : e;
    dispatch({ type: BOOKMARK_CREATE_FAILURE, payload: { error } });
    throw new Error(e);
  }
};
