import { SUBMIT_REGISTRATION_FORM } from '../actions';

const INITIAL_STATE = {
  submitting: false,
  email: undefined
};

const registerReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SUBMIT_REGISTRATION_FORM:
      return { ...state, submitting: action.data };
    default:
      return state;
  }
};

export default registerReducer;
