import { INVITATION_RECEIVE,
  INVITATION_UPDATE,
  INVITATIONS_FETCH_SUCCESS,
  INVITATION_DECLINED,
  INVITATION_DECLINED_UPDATE } from '../actions';

const INITIAL_STATE = {
  invitations: [],
  declinedInvitations: null
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
    case INVITATION_DECLINED: {
      return { ...state, declinedInvitations: action.payload.invitation };
    }
    case INVITATION_DECLINED_UPDATE: {
      return { ...state, declinedInvitations: null };
    }
    case INVITATIONS_FETCH_SUCCESS:
      return { ...state, invitations: action.payload.invitations };
    default:
      return state;
  }
};

export default invitationsReducer;
