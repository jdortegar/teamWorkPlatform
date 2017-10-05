// TODO: remove this file if not needed.
import { RECEIVE_INVITATION } from '../actions/types';

const INITIAL_STATE = {
  invitation: null
};

const invitationsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RECEIVE_INVITATION:
      console.log(action);
      return { ...state };
    default:
      return state;
  }
};

export default invitationsReducer;
