import queryString from 'querystring';
import { pickBy } from 'lodash';

import { buildApiUrl } from 'src/lib/api';
import { extractKeywords } from 'src/lib/keywords';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const SEARCH_REQUEST = 'search/request';
export const SEARCH_SUCCESS = 'search/success';
export const SEARCH_FAILURE = 'search/failure';
export const SEARCH_STALE = 'search/stale';
export const TOGGLE_CASE_SENSITIVE = 'search/toggleCaseSensitive';
export const TOGGLE_AND_OPERATOR = 'search/toggleAndOperator';

// forceGet: true - disabling cache in search requests
export const search = (
  rawQuery = undefined,
  subscriberOrgId,
  caseSensitive = false,
  andOperator = false,
  options = { getKey: false, forceGet: true }
) => {
  const keywords = extractKeywords(rawQuery);
  const query = keywords.join(' ');
  const params = queryString.stringify(
    pickBy({
      query,
      caseSensitive: caseSensitive ? 1 : 0,
      andOperator: andOperator ? 1 : 0
    })
  );

  const requestUrl = buildApiUrl(`ckg/${subscriberOrgId}/files?${params}`, 'v2');

  // Passthrough data that you'll see after going through the reducer. Typically in you mapStateToProps.
  const reduxState = { query };

  return dispatch => {
    dispatch({
      type: SEARCH_REQUEST,
      payload: { query, keywords }
    });

    const thunk = dispatch(
      doAuthenticatedRequest(
        {
          requestUrl,
          method: 'get'
        },
        reduxState,
        options
      )
    );

    if (!options.getKey) {
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
    }

    return thunk;
  };
};

export const toggleCaseSensitive = caseSensitive => dispatch => {
  dispatch({
    type: TOGGLE_CASE_SENSITIVE,
    payload: { caseSensitive }
  });
};

export const toggleAndOperator = andOperator => dispatch => {
  dispatch({
    type: TOGGLE_AND_OPERATOR,
    payload: { andOperator }
  });
};
