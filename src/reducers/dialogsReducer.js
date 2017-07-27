// TODO: remove this file if not needed.
import { SHOW_ORG_DIALOG,
  SHOW_INVITE_DIALOG,
  SUBMITTING_INVITE_ORG_FORM,
  SHOW_ORG_SETTINGS_DIALOG,
  SHOW_TEAM_DIALOG,
  SET_CURRENT_DIALOG_ORG_ID,
  SUBMITTING_TEAM_FORM,
  SHOW_TEAM_ROOM_DIALOG,
  SET_CURRENT_DIALOG_TEAM_ID,
  SUBMITTING_TEAM_ROOM_FORM
} from '../actions/types';

const INITIAL_STATE = {
  showTeamDialog: false,
  showOrgDialog: false,
  showInvitePeopleDialog: false,
  showTeamRoomDialog: false,
  currentInviteSubscriberOrg: null,
  submittingInviteOrgForm: false,
  submittingTeamForm: false,
  submittingTeamRoomForm: false,
  orgSettingsDialog: { show: false, orgId: null },
  currentOrgId: null,
  currentTeamId: null
};

function dialogsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SHOW_ORG_DIALOG:
      return { ...state, showOrgDialog: action.payload };
    case SUBMITTING_INVITE_ORG_FORM:
      return { ...state, submittingInviteOrgForm: action.payload };
    case SHOW_INVITE_DIALOG:
      return { ...state, showInvitePeopleDialog: action.payload.show, currentInviteSubscriberOrg: action.payload.orgId };
    case SHOW_ORG_SETTINGS_DIALOG:
      return { ...state, orgSettingsDialog: action.payload };
    case SHOW_TEAM_DIALOG:
      return { ...state, showTeamDialog: action.payload };
    case SET_CURRENT_DIALOG_ORG_ID:
      return { ...state, currentOrgId: action.payload };
    case SHOW_TEAM_ROOM_DIALOG:
      return { ...state, showTeamRoomDialog: action.payload };
    case SET_CURRENT_DIALOG_TEAM_ID:
      return { ...state, currentTeamId: action.payload };
    case SUBMITTING_TEAM_ROOM_FORM:
      return { ...state, submittingTeamRoomForm: action.payload };
    case SUBMITTING_TEAM_FORM:
      return { ...state, submittingTeamForm: action.payload };
    default:
      return state;
  }
}

export default dialogsReducer;
