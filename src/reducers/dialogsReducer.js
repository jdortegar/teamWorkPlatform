// TODO: remove this file if not needed.
import { SHOW_TEAM_DIALOG, SHOW_ORG_DIALOG, SHOW_INVITE_DIALOG } from '../actions/types';

const INITIAL_STATE = {
  showTeamDialog: false,
  showOrgDialog: false,
  showInviteDialog: false
};

function dialogsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SHOW_ORG_DIALOG:
      return { ...state, showOrgDialog: action.payload };
    default:
      return state;
  }
}

export default dialogsReducer;
