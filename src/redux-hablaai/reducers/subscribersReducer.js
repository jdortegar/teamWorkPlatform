import _ from 'lodash';
import { SUBSCRIBERS_FETCH_SUCCESS, SUBSCRIBER_RECEIVE } from '../actions';

const INITIAL_STATE = {
  subscriberUserIdBySubscriberOrgIdByUserId: {},
  userIdsBySubscriberOrgId: {}
};

const subscribersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SUBSCRIBERS_FETCH_SUCCESS: {
      const subscriberUserIdBySubscriberOrgIdByUserId = _.cloneDeep(state.subscriberUserIdBySubscriberOrgIdByUserId);
      const userIdsBySubscriberOrgId = _.cloneDeep(state.userIdsBySubscriberOrgId);

      const { subscriberOrgId } = action.payload;
      action.payload.subscribers.forEach(subscriber => {
        let subscriberOrgs = subscriberUserIdBySubscriberOrgIdByUserId[subscriber.userId];
        if (!subscriberOrgs) {
          subscriberOrgs = {};
          subscriberUserIdBySubscriberOrgIdByUserId[subscriber.userId] = subscriberOrgs;
        }
        subscriberOrgs[subscriberOrgId] = subscriber.subscriberUserId;
        let subscribers = userIdsBySubscriberOrgId[subscriberOrgId];
        if (!subscribers) {
          subscribers = {};
          userIdsBySubscriberOrgId[subscriberOrgId] = subscribers;
        }
        subscribers[subscriber.userId] = { subscriberUserId: subscriber.subscriberUserId };
      });

      return {
        ...state,
        subscriberUserIdBySubscriberOrgIdByUserId,
        userIdsBySubscriberOrgId
      };
    }
    case SUBSCRIBER_RECEIVE: {
      const subscriberUserIdBySubscriberOrgIdByUserId = _.cloneDeep(state.subscriberUserIdBySubscriberOrgIdByUserId);
      const userIdsBySubscriberOrgId = _.cloneDeep(state.userIdsBySubscriberOrgId);
      const { subscriber, subscriberOrgId } = action.payload;

      let subscriberOrgs = subscriberUserIdBySubscriberOrgIdByUserId[subscriber.userId];
      if (!subscriberOrgs) {
        subscriberOrgs = {};
        subscriberUserIdBySubscriberOrgIdByUserId[subscriber.userId] = subscriberOrgs;
      }
      subscriberOrgs[subscriberOrgId] = subscriber.subscriberUserId;

      let subscribers = userIdsBySubscriberOrgId[subscriberOrgId];
      if (!subscribers) {
        subscribers = {};
        userIdsBySubscriberOrgId[subscriberOrgId] = subscribers;
      }
      subscribers[subscriber.userId] = { subscriberUserId: subscriber.subscriberUserId };

      return {
        ...state,
        subscriberUserIdBySubscriberOrgIdByUserId,
        userIdsBySubscriberOrgId
      };
    }
    default:
      return state;
  }
};

export default subscribersReducer;
