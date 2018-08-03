import config from 'config/env';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const SEARCH_REQUEST = 'search/request';
export const SEARCH_SUCCESS = 'search/success';
export const SEARCH_FAILURE = 'search/failure';
export const SEARCH_STALE = 'search/stale';
export const TOGGLE_CASE_SENSITIVE = 'search/toggleCaseSensitive';

// forceGet: true - disabling cache in search requests
export const search = (
  query = undefined,
  subscriberOrgId,
  caseSensitive = false,
  options = { getKey: false, forceGet: true }
) => {
  const baseUrl = `${config.hablaApiBaseUri}/ckg/getFilesBySearchTerm`;
  const requestUrl = `${baseUrl}/${subscriberOrgId}/${query}/${caseSensitive ? 0 : 1}`;

  // Passthrough data that you'll see after going through the reducer. Typically in you mapStateToProps.
  const reduxState = { query };

  return dispatch => {
    dispatch({
      type: SEARCH_REQUEST,
      payload: { query }
    });

    if (!query) {
      dispatch({
        type: SEARCH_FAILURE,
        payload: { query }
      });
      return null;
    }

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
          if (response.data && response.data !== RESPONSE_STALE) {
            const { files } = response.data.message;
            dispatch({
              type: SEARCH_SUCCESS,
              payload: { files }
            });
          }
          if (response.data && response.data === RESPONSE_STALE) {
            dispatch({ type: SEARCH_STALE });
          }
          return response;
        },
        error => {
          dispatch({
            type: SEARCH_FAILURE,
            payload: { query }
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
