import { SUBMIT_FORM, FLIP_CARD, VERIFY_EMAIL } from '../actions/types';

const INITIAL_STATE = {
  submitting: false,
  flip: '',
  email: undefined
};

const registerReducer = (state = INITIAL_STATE, action) => {
   switch (action.type) {
      case SUBMIT_FORM:
        return { ...state, submitting: action.data };
      case FLIP_CARD:
        return { ...state, flip: action.data };
      case VERIFY_EMAIL:
        return { ...state, email: action.data };
      default:
        return state;
   }
};

export default registerReducer;
