import config from 'config/env';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const SUBSCRIBERORGS_FETCH_SUCCESS = 'subscriberorgs/fetch/success';

export const fetchSubscriberOrgs = (options = { getKey: false, forceGet: false }) => { // eslint-disable-line import/prefer-default-export
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/subscriberOrgs/getSubscriberOrgs`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = {};

  return (dispatch) => {
    const thunk = dispatch(doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    }, reduxState, options));

    if (!options.getKey) {
      thunk.then((response) => {
        if ((response.data) && (response.data !== RESPONSE_STALE)) {
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
