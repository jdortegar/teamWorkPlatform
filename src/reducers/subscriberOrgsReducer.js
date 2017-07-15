import {
  REQUEST_SUBSCRIBER_ORGS,
  RECEIVE_SUBSCRIBER_ORGS,
  REQUEST_SUBSCRIBER_ORGS_ERROR
} from '../actions/types';

const INITIAL_STATE = {
  data: [],
  received: false,
  requesting: false,
  error: null
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
    case RECEIVE_SUBSCRIBER_ORGS:
      return {
        ...state,
        data: action.payload,
        received: true,
        requesting: false,
        error: null
      };
    case REQUEST_SUBSCRIBER_ORGS_ERROR:
      return {
        ...state,
        data: [],
        received: false,
        requesting: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default subscriberOrgsReducer;
