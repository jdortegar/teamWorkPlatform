import { omit } from 'lodash';
import { URLREQUEST_CREATE, URLREQUEST_SUCCESS, URLREQUEST_FAILURE, URLREQUEST_CLEAR } from 'src/actions';

const urlRequestReducer = (state = {}, action) => {
  switch (action.type) {
    case URLREQUEST_CREATE:
    case URLREQUEST_SUCCESS: {
      const { requestUrl, request, ...other } = action.payload;
      return {
        ...state,
        [requestUrl]: {
          actionType: action.type,
          payload: other,
          error: null,
          request
        }
      };
    }
    case URLREQUEST_FAILURE: {
      const { requestUrl, error, ...other } = action.payload;
      return {
        ...state,
        [requestUrl]: {
          actionType: action.type,
          payload: other,
          error
        }
      };
    }
    case URLREQUEST_CLEAR: {
      return omit(state, action.payload.requestUrl);
    }
    default:
      return state;
  }
};

export default urlRequestReducer;
