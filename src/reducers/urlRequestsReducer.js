import _ from 'lodash';
import { URLREQUEST, URLREQUEST_SUCCESS, URLREQUEST_ERROR, URLREQUEST_CLEAR } from '../actions/urlRequest';

const INITIAL_STATE = {
  urlRequests: {}
};

const urlRequestReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case URLREQUEST:
    case URLREQUEST_SUCCESS: {
      const payload = _.cloneDeep(action.payload);
      delete payload.requestUrl;
      delete payload.request;
      const updatedState = _.cloneDeep(state);
      updatedState[action.payload.requestUrl] = {
        actionType: action.type,
        request: action.payload.request,
        payload,
        error: undefined
      };
      return updatedState;
    }
    case URLREQUEST_ERROR: {
      const payload = _.cloneDeep(action.errorMeta);
      delete payload.requestUrl;
      delete payload.request;
      const updatedState = _.cloneDeep(state);
      updatedState[action.errorMeta.requestUrl] = {
        actionType: action.type,
        request: action.errorMeta.request,
        payload,
        error: action.payload
      };
      return updatedState;
    }
    case URLREQUEST_CLEAR: {
      const updatedState = _.cloneDeep(state);
      delete updatedState[action.payload.requestUrl];
      return updatedState;
    }
    default:
      return state;
  }
};

export default urlRequestReducer;
