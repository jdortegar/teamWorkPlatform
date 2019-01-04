import queryString from 'querystring';
import { pickBy } from 'lodash';

import { buildApiUrl } from 'src/lib/api';
import { extractKeywords } from 'src/lib/keywords';
import { getCurrentSubscriberOrgId } from 'src/selectors';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const SEARCH_REQUEST = 'search/request';
export const SEARCH_SUCCESS = 'search/success';
export const SEARCH_FAILURE = 'search/failure';
export const SEARCH_STALE = 'search/stale';
export const TOGGLE_CASE_SENSITIVE = 'search/toggleCaseSensitive';
export const TOGGLE_EXACT_MATCH = 'search/toggleExactMatch';

export const search = (rawQuery = undefined, { teamId, caseSensitive = false, exactMatch = false } = {}) => (
  dispatch,
  getState
) => {
  const orgId = getCurrentSubscriberOrgId(getState());
  const keywords = extractKeywords(rawQuery);
  const query = keywords.join(' ');
  const params = queryString.stringify(
    pickBy({
      query,
      caseSensitive: caseSensitive ? 1 : 0,
      andOperator: exactMatch ? 1 : 0
    })
  );

  const teamLevel = teamId ? `/teams/${teamId}` : '';
  const requestUrl = buildApiUrl(`ckg/${orgId}${teamLevel}/files?${params}`, 'v2');

  dispatch({
    type: SEARCH_REQUEST,
    payload: { query, keywords, teamId }
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
          type: SEARCH_SUCCESS,
          payload: { files: response.data }
        });
      }
      if (response.data === RESPONSE_STALE) {
        dispatch({ type: SEARCH_STALE });
      }
      return response;
    },
    error => {
      dispatch({
        type: SEARCH_FAILURE,
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
