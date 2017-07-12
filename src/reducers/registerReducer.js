import { SUBMIT_FORM } from '../actions/types';

const INITIAL_STATE = {
  submitting: false
};

const registerReducer = (state = INITIAL_STATE, action) => {
   switch (action.type) {
      case SUBMIT_FORM:
         return { ...state, submitting: action.data };
      default:
         return state;
   }
};

export default registerReducer;
