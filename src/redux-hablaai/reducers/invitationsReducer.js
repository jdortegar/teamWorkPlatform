import { INVITATION_RECEIVE, INVITATION_UPDATE, INVITATIONS_FETCH_SUCCESS } from '../actions';

const INITIAL_STATE = {
  invitations: []
};

const invitationsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INVITATION_RECEIVE:
      return { ...state, invitations: [...state.invitations, action.payload.invitation] };
    case INVITATION_UPDATE: {
      const invitations = state.invitations.filter((invitation) => {
        return invitation !== action.payload.invitation;
      });
      return { ...state, invitations: [...invitations] };
    }
    case INVITATIONS_FETCH_SUCCESS:
      return { ...state, invitations: action.payload.invitations };
    default:
      return state;
  }
};

export default invitationsReducer;
