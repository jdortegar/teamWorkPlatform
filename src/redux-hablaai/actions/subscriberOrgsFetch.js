import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const SUBSCRIBERORGS_FETCH_SUCCESS = 'subscriberorgs/fetch/success';
export const SUBSCRIBERORG_DATA_FETCH_SUCCESS = 'subscriberorgsData/fetch/success';

export const fetchSubscriberOrgs = () => dispatch => {
  const requestUrl = buildApiUrl('subscriberOrgs/getSubscriberOrgs');
  const thunk = dispatch(
    doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    })
  );

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

  return thunk;
};

export const fetchDataSubscriberOrgs = subscriberOrgId => dispatch => {
  const requestUrl = buildApiUrl(`organizations/${subscriberOrgId}`, 'v2');
  const thunk = dispatch(
    doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    })
  );

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

  return thunk;
};
