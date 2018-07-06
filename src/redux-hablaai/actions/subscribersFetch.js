import config from 'config/env';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';
import { sortByFirstName } from '../selectors/helpers';

export const SUBSCRIBERS_FETCH_SUCCESS = 'subscribers/fetch/success';

export const fetchSubscribersBySubscriberOrgId = (subscriberOrgId, options = { getKey: false, forceGet: false }) => {
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/subscriberOrgs/getSubscribers/${subscriberOrgId}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { subscriberOrgId };

  return (dispatch) => {
    const thunk = dispatch(doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    }, reduxState, options));

    if (!options.getKey) {
      thunk.then((response) => {
        if ((response.data) && (response.data !== RESPONSE_STALE)) {
          const subscribers = response.data.subscribers.sort(sortByFirstName);
          dispatch({
            type: SUBSCRIBERS_FETCH_SUCCESS,
            payload: { subscribers, subscriberOrgId }
          });
        }
        return response;
      });
    }

    return thunk;
  };
};
