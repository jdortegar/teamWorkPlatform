import {
  REQUEST_SUBSCRIBER_ORGS,
  RECEIVE_SUBSCRIBER_ORGS,
  REQUEST_SUBSCRIBER_ORGS_ERROR,
  SET_CURRENT_SUBSCRIBER_ORG
} from '../actions/types';

const INITIAL_STATE = {
  data: [],
  received: false,
  requesting: false,
  error: null,
  currentSubscriberOrg: null
};

const subscriberOrgsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REQUEST_SUBSCRIBER_ORGS:
      return {
        ...state,
        data: [],
        received: false,
        requesting: true,
        error: null
      };
    case RECEIVE_SUBSCRIBER_ORGS: {
      let currentSubscriberOrg = state.currentSubscriberOrg;
      const data = action.payload;
      const notInList = (currentSubscriberOrg === null) || data.every(subscriberOrg => (currentSubscriberOrg.subscriberOrgId !== subscriberOrg.subscriberOrgId));
      currentSubscriberOrg = (notInList) ? null : currentSubscriberOrg;
      return {
        ...state,
        data,
        received: true,
        requesting: false,
        error: null,
        currentSubscriberOrg
      };
    }
    case REQUEST_SUBSCRIBER_ORGS_ERROR:
      return {
        ...state,
        data: [],
        received: false,
        requesting: false,
        error: action.payload
      };
    case SET_CURRENT_SUBSCRIBER_ORG:
      return {
        ...state,
        currentSubscriberOrg: action.payload
      };
    default:
      return state;
  }
};

export default subscriberOrgsReducer;
