import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const SEARCH_REQUEST = 'search/request';
export const SEARCH_SUCCESS = 'search/success';
export const SEARCH_ERROR = 'search/error';
export const SEARCH_STALE = 'search/stale';

// forceGet: true - disabling cache in search requests
export const search = (query = undefined, subscriberOrgId, options = { getKey: false, forceGet: true }) => {
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `https://y2rhikgvq4.execute-api.us-west-2.amazonaws.com/dev/graphapi/ckg/files/${subscriberOrgId}/${query}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { query };

  return (dispatch) => {
    dispatch({
      type: SEARCH_REQUEST,
      payload: { query }
    });

    if (!query) {
      dispatch({
        type: SEARCH_ERROR,
        payload: { query }
      });
      return null;
    }

    const thunk = dispatch(doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    }, reduxState, options));

    if (!options.getKey) {
      thunk.then((response) => {
        if (response.data && response.data !== RESPONSE_STALE) {
          const { files } = response.data;
          dispatch({
            type: SEARCH_SUCCESS,
            payload: { files }
          });
        }
        if (response.data && response.data === RESPONSE_STALE) {
          dispatch({ type: SEARCH_STALE });
        }
        return response;
      }, (error) => {
        dispatch({
          type: SEARCH_ERROR,
          payload: { query }
        });
        return error;
      });
    }

    return thunk;
  };
};
