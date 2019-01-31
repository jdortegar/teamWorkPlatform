import _ from 'lodash';

import {
  SUBSCRIPTION_FETCH_SUCCESS,
  SUBSCRIPTION_CANCEL_SUCCESS,
  SUBSCRIPTION_COUPONS_FETCH_SUCCESS,
  SUBSCRIPTION_UPDATE_SUCCESS,
  SUBSCRIPTION_PAYPAL_FETCH_SUCCESS,
  SUBSCRIPTION_PAYPAL_CANCEL_SUCCESS
} from 'src/actions';

const INITIAL_STATE = {
  coupons: {},
  stripeSubscription: {},
  paypalSubscription: {}
};

const subscriptionReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SUBSCRIPTION_FETCH_SUCCESS:
    case SUBSCRIPTION_UPDATE_SUCCESS:
    case SUBSCRIPTION_CANCEL_SUCCESS: {
      const subscription = _.cloneDeep(state);
      subscription.stripeSubscription = action.payload;

      return {
        ...state,
        ...subscription
      };
    }
    case SUBSCRIPTION_COUPONS_FETCH_SUCCESS: {
      const subscription = _.cloneDeep(state);
      subscription.coupons = action.payload;
      return {
        ...state,
        ...subscription
      };
    }
    case SUBSCRIPTION_PAYPAL_FETCH_SUCCESS:
    case SUBSCRIPTION_PAYPAL_CANCEL_SUCCESS: {
      const subscription = _.cloneDeep(state);
      subscription.paypalSubscription = action.payload;

      return {
        ...state,
        ...subscription
      };
    }
    default:
      return state;
  }
};

export default subscriptionReducer;
