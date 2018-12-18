import { buildApiUrl } from 'src/lib/api';
import { sortByFirstName } from '../selectors/helpers';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const SUBSCRIBERS_FETCH_SUCCESS = 'subscribers/fetch/success';

export const fetchSubscribersBySubscriberOrgId = subscriberOrgId => dispatch => {
  const requestUrl = buildApiUrl(`subscriberOrgs/getSubscribers/${subscriberOrgId}`);
  const thunk = dispatch(
    doAuthenticatedRequest(
      {
        requestUrl,
        method: 'get'
      },
      { subscriberOrgId }
    )
  );

  thunk.then(response => {
    if (response.data && response.data !== RESPONSE_STALE) {
      const subscribers = response.data.subscribers.sort(sortByFirstName);
      dispatch({
        type: SUBSCRIBERS_FETCH_SUCCESS,
        payload: { subscribers, subscriberOrgId }
      });
    }
    return response;
  });

  return thunk;
};
