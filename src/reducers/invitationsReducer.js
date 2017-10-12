// TODO: remove this file if not needed.
import { RECEIVE_INVITATION, UPDATE_INVITATION } from '../actions/types';

const INITIAL_STATE = {
  invitation: []
};

const invitationsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RECEIVE_INVITATION:
      return { ...state, invitation: [...state.invitation, action.payload] };
    case UPDATE_INVITATION: {
      const invitations = state.invitation.filter((invitation) => {
        return invitation !== action.payload;
      });
      return { ...state, invitation: [...invitations] };
    }
    default:
      return state;
  }
};

export default invitationsReducer;
