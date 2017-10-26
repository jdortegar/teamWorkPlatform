import config from '../config';
import { doAuthenticatedRequest } from './urlRequest';

export const SUBSCRIBERS_FETCH_SUCCESS = 'subscribers/fetch/success';

export const fetchSubscribersBySubscriberOrgId = (subscriberOrgId, getKey) => {
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/subscriberOrgs/getSubscribers/${subscriberOrgId}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = {};

  return (dispatch) => {
    const thunk = dispatch(doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    }, reduxState, getKey));

    if (!getKey) {
      thunk.then((response) => {
        if (response.data) {
          const { subscribers } = response.data;
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
