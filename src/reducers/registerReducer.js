// TODO: remove this file if not needed.
import { SUBMIT_REGISTRATION_FORM, VERIFY_EMAIL } from '../actions/types';

const INITIAL_STATE = {
  submitting: false,
  email: undefined
};

const registerReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SUBMIT_REGISTRATION_FORM:
      return { ...state, submitting: action.data };
    case VERIFY_EMAIL:
      return { ...state, email: action.data };
    default:
      return state;
  }
};

export default registerReducer;
