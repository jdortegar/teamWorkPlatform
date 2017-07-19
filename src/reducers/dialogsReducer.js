import { SHOW_TEAM_DIALOG, SHOW_ORG_DIALOG } from '../actions/types';

const INITIAL_STATE = {
  showTeamDialog: false,
  showOrgDialog: false
}

function dialogsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SHOW_TEAM_DIALOG:
      return { ...state, showTeamDialog: action.payload };
    case SHOW_ORG_DIALOG:
      return { ...state, showOrgDialog: action.payload };
     default:
        return state;
  }
}

export default dialogsReducer;
