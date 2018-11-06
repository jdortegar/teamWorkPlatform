import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const SUBSCRIPTION_FETCH_SUCCESS = 'subscription/fetch/success';
export const SUBSCRIPTION_CANCEL_SUCCESS = 'subscription/cancel/success';
export const SUBSCRIPTION_COUPONS_FETCH_SUCCESS = 'subscriptionCoupons/fetch/success';
export const SUBSCRIPTION_UPDATE_SUCCESS = 'subscription/update/success';

export const fetchSubscription = (subscriptionId, options = { getKey: false, forceGet: false }) => {
  const requestUrl = buildApiUrl(`subscriptions/${subscriptionId}`, 'v2');

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
            type: SUBSCRIPTION_FETCH_SUCCESS,
            payload: { ...data }
          });
        }
        return response;
      });
    }

    return thunk;
  };
};

export const fetchSubscriptionCoupons = (options = { getKey: false, forceGet: false }) => {
  const requestUrl = buildApiUrl(`coupons`, 'v2');

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
            type: SUBSCRIPTION_COUPONS_FETCH_SUCCESS,
            payload: { ...data }
          });
        }
        return response;
      });
    }

    return thunk;
  };
};

export const updateSubscription = (updateObject, options = { getKey: false, forceGet: false }) => {
  const requestUrl = buildApiUrl(`subscriptions`, 'v2');

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { updateObject };
  return dispatch => {
    const thunk = dispatch(
      doAuthenticatedRequest(
        {
          requestUrl,
          method: 'patch',
          data: updateObject
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
            type: SUBSCRIPTION_UPDATE_SUCCESS,
            payload: { ...data }
          });
        }
        return response;
      });
    }

    return thunk;
  };
};

export const cancelSubscription = (subscriptionId, options = { getKey: false, forceGet: true }) => {
  const requestUrl = buildApiUrl(`subscriptions`, 'v2');
  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { subscriptionId };

  return dispatch => {
    const thunk = dispatch(
      doAuthenticatedRequest(
        {
          requestUrl,
          method: 'delete',
          data: subscriptionId
        },
        reduxState,
        options
      )
    );

    if (!options.getKey) {
      thunk.then(response => {
        if (response.data !== RESPONSE_STALE) {
          dispatch({
            type: SUBSCRIPTION_CANCEL_SUCCESS,
            payload: { data: response.data }
          });
        }
        return response;
      });
    }

    return thunk;
  };
};
