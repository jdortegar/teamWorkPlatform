import { LOGIN_REQUEST, LOGIN_FAILURE, LOGIN_SUCCESS } from '../actions';

const INITIAL_STATE = {
  loggingIn: false,
  error: null,
  authenticated: false,
  user: null,
  token: null,
  websocketUrl: null,
  resourcesUrl: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loggingIn: true,
        error: null,
        authenticated: false,
        token: null
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        error: null,
        authenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        websocketUrl: action.payload.websocketUrl,
        resourcesUrl: action.payload.resourcesUrl
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        loggingIn: false,
        error: action.payload.error,
        authenticated: false,
        token: null
      };
    default:
      return state;
  }
};
