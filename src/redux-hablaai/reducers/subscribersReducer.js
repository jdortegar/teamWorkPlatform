import _ from 'lodash';
import { SUBSCRIBERS_FETCH_SUCCESS } from '../actions';

const INITIAL_STATE = {
  subscriberByUserId: {},
  subscriberUserIdByUserId: {},
  userIdsBySubscriberOrgId: {}
};

const subscribersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SUBSCRIBERS_FETCH_SUCCESS: {
      const subscriberByUserId = _.cloneDeep(state.subscriberByUserId);
      const subscriberUserIdByUserId = _.cloneDeep(state.subscriberUserIdByUserId);
      const userIdsBySubscriberOrgId = _.cloneDeep(state.userIdsBySubscriberOrgId);

      const subscriberOrgId = action.payload.subscriberOrgId;
      action.payload.subscribers.forEach((subscriber) => {
        subscriberByUserId[subscriber.userId] = subscriber;
        subscriberUserIdByUserId[subscriber.userId] = subscriber.subscriberUserId;
        let subscribers = userIdsBySubscriberOrgId[subscriberOrgId];
        if (!subscribers) {
          subscribers = [];
          userIdsBySubscriberOrgId[subscriberOrgId] = subscribers;
        }
        subscribers.push(subscriber.userId);
      });

      return {
        ...state,
        subscriberByUserId,
        subscriberUserIdByUserId,
        userIdsBySubscriberOrgId
      };
    }
    default:
      return state;
  }
};

export default subscribersReducer;
