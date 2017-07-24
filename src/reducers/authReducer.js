import {
  LOGGING_IN,
  AUTH_USER
} from '../actions/types';

const INITIAL_STATE = {
  loggingIn: false,
  user: null,
  error: '',
  message: '',
  content: '',
  authenticated: false
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGGING_IN:
      return { ...state, loggingIn: action.payload };
    case AUTH_USER:
      return { ...state, user: action.payload.user, error: '', message: '', authenticated: true };
    default:
      return state;
  }
}
