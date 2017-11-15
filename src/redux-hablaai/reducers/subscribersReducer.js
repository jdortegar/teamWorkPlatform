import _ from 'lodash';
import { SUBSCRIBERS_FETCH_SUCCESS, SUBSCRIBER_RECEIVE } from '../actions';

const INITIAL_STATE = {
  subscriberUserIdByUserId: {},
  userIdsBySubscriberOrgId: {}
};

const subscribersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SUBSCRIBERS_FETCH_SUCCESS: {
      const subscriberUserIdByUserId = _.cloneDeep(state.subscriberUserIdByUserId);
      const userIdsBySubscriberOrgId = _.cloneDeep(state.userIdsBySubscriberOrgId);

      const subscriberOrgId = action.payload.subscriberOrgId;
      action.payload.subscribers.forEach((subscriber) => {
        subscriberUserIdByUserId[subscriber.userId] = subscriber.subscriberUserId;
        let subscribers = userIdsBySubscriberOrgId[subscriberOrgId];
        if (!subscribers) {
          subscribers = {};
          userIdsBySubscriberOrgId[subscriberOrgId] = subscribers;
        }
        subscribers[subscriber.userId] = { subscriberUserId: subscriber.subscriberUserId };
      });

      return {
        ...state,
        subscriberUserIdByUserId,
        userIdsBySubscriberOrgId
      };
    }
    case SUBSCRIBER_RECEIVE: {
      const subscriberUserIdByUserId = _.cloneDeep(state.subscriberUserIdByUserId);
      const userIdsBySubscriberOrgId = _.cloneDeep(state.userIdsBySubscriberOrgId);
      const { subscriber, subscriberOrgId } = action.payload;

      subscriberUserIdByUserId[subscriber.userId] = subscriber.subscriberUserId;
      let subscribers = userIdsBySubscriberOrgId[subscriberOrgId];
      if (!subscribers) {
        subscribers = {};
        userIdsBySubscriberOrgId[subscriberOrgId] = subscribers;
      }
      subscribers[subscriber.userId] = { subscriberUserId: subscriber.subscriberUserId };

      return {
        ...state,
        subscriberUserIdByUserId,
        userIdsBySubscriberOrgId
      };
    }
    default:
      return state;
  }
};

export default subscribersReducer;
