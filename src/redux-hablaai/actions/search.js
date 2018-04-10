import sampleData from 'pages/SearchPage/sample-data.json';
import config from '../config';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const SEARCH_REQUEST = 'search/request';
export const SEARCH_SUCCESS = 'search/success';

// TODO: get the correct endpoint from backend
const IS_BACKEND_DONE = false;

export const search = (query = undefined, options = { getKey: false, forceGet: false }) => {
  // requestUrl is the key into redux state.urlRequests.
  let requestUrl = `${config.hablaApiBaseUri}/search`;
  requestUrl = (query) ? `${requestUrl}?q=${query}` : requestUrl;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { query };

  return (dispatch) => {
    dispatch({
      type: SEARCH_REQUEST,
      payload: { query }
    });

    if (!IS_BACKEND_DONE) {
      setTimeout(() => {
        dispatch({
          type: SEARCH_SUCCESS,
          payload: {
            query,
            results: sampleData.filter(r => r.fileName.includes(query))
          }
        });
      }, 1500);
      return null;
    }

    const thunk = dispatch(doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    }, reduxState, options));

    if (!options.getKey) {
      thunk.then((response) => {
        if ((response.data) && (response.data !== RESPONSE_STALE)) {
          const { results } = response.data;
          dispatch({
            type: SEARCH_SUCCESS,
            payload: { results }
          });
          return results;
        }
        return response;
      });
    }

    return thunk;
  };
};
