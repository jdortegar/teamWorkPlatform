import { buildApiUrl } from 'src/lib/api';
import { extractKeywords } from 'src/lib/keywords';
import { getCurrentUserId } from 'src/selectors';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const GLOBAL_SEARCH_REQUEST = 'search/global/request';
export const GLOBAL_SEARCH_SUCCESS = 'search/global/success';
export const GLOBAL_SEARCH_FAILURE = 'search/global/failure';
export const GLOBAL_SEARCH_STALE = 'search/global/stale';
export const TOGGLE_CASE_SENSITIVE = 'search/toggleCaseSensitive';
export const TOGGLE_EXACT_MATCH = 'search/toggleExactMatch';

export const globalSearch = (rawQuery = undefined, { all = false, caseSensitive = false, exactMatch = false } = {}) => (
  dispatch,
  getState
) => {
  const currentUserId = getCurrentUserId(getState());
  const keywords = extractKeywords(rawQuery, 6);
  const query = keywords.join(' ');

  const requestUrl = buildApiUrl(
    `datak/getDataFilesBySearchTerm/${currentUserId}/${query}/${caseSensitive ? 0 : 1}/${exactMatch ? 1 : 0}`,
    'v2'
  );

  console.log('action', all);

  dispatch({
    type: GLOBAL_SEARCH_REQUEST,
    payload: {
      all,
      query,
      keywords
    }
  });

  const thunk = dispatch(
    doAuthenticatedRequest(
      {
        requestUrl,
        method: 'get'
      },
      { query }
    )
  );

  thunk.then(
    response => {
      if (response.data !== RESPONSE_STALE) {
        dispatch({
          type: GLOBAL_SEARCH_SUCCESS,
          payload: { items: response.data.message }
        });
      }
      if (response.data === RESPONSE_STALE) {
        dispatch({ type: GLOBAL_SEARCH_STALE });
      }
      return response;
    },
    error => {
      dispatch({
        type: GLOBAL_SEARCH_FAILURE,
        payload: { query, keywords }
      });
      return error;
    }
  );

  return thunk;
};

export const toggleCaseSensitive = caseSensitive => dispatch => {
  dispatch({
    type: TOGGLE_CASE_SENSITIVE,
    payload: { caseSensitive }
  });
};

export const toggleExactMatch = exactMatch => dispatch => {
  dispatch({
    type: TOGGLE_EXACT_MATCH,
    payload: { exactMatch }
  });
};
