import {
  REQUESTING_SUBSCRIBERS,
  RECEIVE_SUBSCRIBERS,
  REQUEST_SUBSCRIBERS_ERROR
} from '../actions/types';

const INITIAL_STATE = {
  subscribersBySubscriberOrgId: {},

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
      const subscribers = {};
      subscribersBySubscriberOrgId[action.payload.subscriberOrgId] = subscribers;

      action.payload.subscribers.forEach((subscriber) => { subscribers[subscriber.userId] = subscriber; });

      return {
        ...state,
        subscribersBySubscriberOrgId,
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
