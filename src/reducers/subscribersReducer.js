import _ from 'lodash';
import {
  REQUESTING_SUBSCRIBERS,
  RECEIVE_SUBSCRIBERS,
  REQUEST_SUBSCRIBERS_ERROR
} from '../actions/types';

const INITIAL_STATE = {
  subscribersBySubscriberOrgId: {}, // TODO: deprecated.  Remove when using selector instead.
  subscriberUserIdsBySubscriberOrgId: {},

  received: false,
  requesting: false,
  error: null,
  errorMeta: {}
};

const subscribersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REQUESTING_SUBSCRIBERS:
      return {
        ...state,
        received: false,
        requesting: true,
        error: null,
        errorMeta: {}
      };
    case RECEIVE_SUBSCRIBERS: {
      const subscribersBySubscriberOrgId = _.cloneDeep(state.subscribersBySubscriberOrgId);
      subscribersBySubscriberOrgId[action.payload.subscriberOrgId] = action.payload.subscribers;

      const subscriberUserIdsBySubscriberOrgId = _.cloneDeep(state.subscriberUserIdsBySubscriberOrgId);
      subscriberUserIdsBySubscriberOrgId[action.payload.subscriberOrgId] = action.payload.subscribers.map(subscriber => subscriber.userId);

      return {
        ...state,
        subscribersBySubscriberOrgId,
        subscriberUserIdsBySubscriberOrgId,
        received: true,
        requesting: false,
        error: null,
        errorMeta: {}
      };
    }
    case REQUEST_SUBSCRIBERS_ERROR:
      return {
        ...state,
        received: false,
        requesting: false,
        error: action.payload,
        errorMeta: action.meta
      };
    default:
      return state;
  }
};

export default subscribersReducer;
