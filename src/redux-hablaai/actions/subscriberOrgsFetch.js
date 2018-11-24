import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const SUBSCRIBERORGS_FETCH_SUCCESS = 'subscriberorgs/fetch/success';
export const SUBSCRIBERORG_DATA_FETCH_SUCCESS = 'subscriberorgsData/fetch/success';

export const fetchSubscriberOrgs = (options = { getKey: false, forceGet: false }) => {
  const requestUrl = buildApiUrl('subscriberOrgs/getSubscriberOrgs');

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = {};

  return dispatch => {
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
      thunk.then(response => {
        if (response.data && response.data !== RESPONSE_STALE) {
          const { subscriberOrgs } = response.data;
          dispatch({
            type: SUBSCRIBERORGS_FETCH_SUCCESS,
            payload: { subscriberOrgs }
          });
        }
        return response;
      });
    }

    return thunk;
  };
};

export const fetchDataSubscriberOrgs = (subscriberOrgId, options = { getKey: false, forceGet: false }) => {
  const requestUrl = buildApiUrl(`organizations/${subscriberOrgId}`, 'v2');

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = {};
  return dispatch => {
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
      thunk.then(response => {
        if (response.data && response.data !== RESPONSE_STALE) {
          const { data } = response;
          dispatch({
            type: SUBSCRIBERORG_DATA_FETCH_SUCCESS,
            payload: { ...data }
          });
        }
        return response;
      });
    }

    return thunk;
  };
};
