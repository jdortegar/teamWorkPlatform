import _ from 'lodash';

import {
  SUBSCRIPTION_FETCH_SUCCESS,
  SUBSCRIPTION_CANCEL_SUCCESS,
  SUBSCRIPTION_COUPONS_FETCH_SUCCESS,
  SUBSCRIPTION_UPDATE_SUCCESS
} from 'src/actions';

const INITIAL_STATE = {
  coupons: {}
};

const subscriptionReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SUBSCRIPTION_FETCH_SUCCESS: {
      const subscription = action.payload;
      return {
        ...state,
        ...subscription
      };
    }
    case SUBSCRIPTION_CANCEL_SUCCESS: {
      const subscription = action.payload.data;
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
    case SUBSCRIPTION_UPDATE_SUCCESS: {
      const subscription = action.payload;
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
