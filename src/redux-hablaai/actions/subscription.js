import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const SUBSCRIPTION_FETCH_SUCCESS = 'subscription/fetch/success';
export const SUBSCRIPTION_CANCEL_SUCCESS = 'subscription/cancel/success';
export const SUBSCRIPTION_COUPONS_FETCH_SUCCESS = 'subscriptionCoupons/fetch/success';
export const SUBSCRIPTION_UPDATE_SUCCESS = 'subscription/update/success';

export const fetchSubscription = subscriptionId => dispatch => {
  const requestUrl = buildApiUrl(`subscriptions/${subscriptionId}`, 'v2');

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
        type: SUBSCRIPTION_FETCH_SUCCESS,
        payload: { ...data }
      });
    }
    return response;
  });

  return thunk;
};

export const fetchSubscriptionCoupons = () => dispatch => {
  const requestUrl = buildApiUrl(`coupons`, 'v2');
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
        type: SUBSCRIPTION_COUPONS_FETCH_SUCCESS,
        payload: { ...data }
      });
    }
    return response;
  });

  return thunk;
};

export const updateSubscription = updateObject => dispatch => {
  const requestUrl = buildApiUrl(`subscriptions`, 'v2');
  const thunk = dispatch(
    doAuthenticatedRequest({
      requestUrl,
      method: 'patch',
      data: updateObject
    })
  );

  thunk.then(response => {
    if (response.data && response.data !== RESPONSE_STALE) {
      const { data } = response;
      dispatch({
        type: SUBSCRIPTION_UPDATE_SUCCESS,
        payload: { ...data }
      });
    }
    return response;
  });

  return thunk;
};

export const cancelSubscription = subscriptionId => dispatch => {
  const requestUrl = buildApiUrl(`subscriptions`, 'v2');
  const thunk = dispatch(
    doAuthenticatedRequest(
      {
        requestUrl,
        method: 'delete',
        data: subscriptionId
      },
      { subscriptionId }
    )
  );

  thunk.then(response => {
    if (response.data !== RESPONSE_STALE) {
      dispatch({
        type: SUBSCRIPTION_CANCEL_SUCCESS,
        payload: { data: response.data }
      });
    }
    return response;
  });

  return thunk;
};
