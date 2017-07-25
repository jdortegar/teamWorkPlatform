// TODO: remove this file if not needed.
import { SHOW_ORG_DIALOG, SHOW_INVITE_DIALOG, SUBMITTING_INVITE_ORG_FORM } from '../actions/types';

const INITIAL_STATE = {
  showTeamDialog: false,
  showOrgDialog: false,
  showInvitePeopleDialog: false,
  currentInviteSubscriberOrg: null,
  submittingInviteOrgForm: false
};

function dialogsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SHOW_ORG_DIALOG:
      return { ...state, showOrgDialog: action.payload };
    case SUBMITTING_INVITE_ORG_FORM:
      return { ...state, submittingInviteOrgForm: action.payload };
    case SHOW_INVITE_DIALOG:
      return { ...state, showInvitePeopleDialog: action.payload.show, currentInviteSubscriberOrg: action.payload.orgId };
    default:
      return state;
  }
}

export default dialogsReducer;
