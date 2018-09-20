import { SENT_INVITATIONS_FETCH_SUCCESS } from 'src/actions';

const INITIAL_STATE = {
  sentInvitations: []
};

const sentInvitationsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SENT_INVITATIONS_FETCH_SUCCESS: {
      // The state of the invitation, null | ACCEPTED | DECLINED | EXPIRED, where null means pending.
      switch (action.payload.state) {
        case 'PENDING':
        case null:
          return { ...state, pending: action.payload.sentInvitations };
        case 'DECLINED':
          return { ...state, declined: action.payload.sentInvitations };
        case 'EXPIRED':
          return { ...state, expired: action.payload.sentInvitations };
        default:
          break;
      }
      return state;
    }
    default:
      return state;
  }
};

export default sentInvitationsReducer;
