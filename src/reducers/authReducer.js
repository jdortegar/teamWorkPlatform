import {
  LOGGING_IN,
  LOGGING_IN_ERROR,
  AUTH_USER
} from '../actions/types';

const INITIAL_STATE = {
  loggingIn: false,
  user: null,
  error: false,
  message: '',
  content: '',
  authenticated: false
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGGING_IN:
      return {
        ...state,
        loggingIn: action.payload,
        error: false
      };
    case LOGGING_IN_ERROR:
      return {
        ...state,
        loggingIn: false,
        error: true
      };
    case AUTH_USER:
      return { ...state, user: action.payload.user, error: false, message: '', authenticated: true };
    default:
      return state;
  }
}
