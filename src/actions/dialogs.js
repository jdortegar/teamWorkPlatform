import { SHOW_ORG_DIALOG,
  SHOW_INVITE_DIALOG,
  SHOW_ORG_SETTINGS_DIALOG,
  SHOW_TEAM_DIALOG,
  SET_CURRENT_DIALOG_ORG_ID,
  SHOW_TEAM_ROOM_DIALOG,
  SET_CURRENT_DIALOG_TEAM_ID
} from './types';

export function toggleOrgDialog(show) {
  return {
    type: SHOW_ORG_DIALOG,
    payload: show
  };
}

export function toggleInvitePeopleDialog(show, orgId = null) {
  return {
    type: SHOW_INVITE_DIALOG,
    payload: { show, orgId }
  };
}

export function toggleOrgSettingsDialog(show, orgId = null) {
  return {
    type: SHOW_ORG_SETTINGS_DIALOG,
    payload: { show, orgId }
  };
}

export function toggleTeamDialog(show, orgId = null) {
  return (dispatch) => {
    dispatch({ type: SHOW_TEAM_DIALOG, payload: show });
    dispatch({ type: SET_CURRENT_DIALOG_ORG_ID, payload: orgId });
  };
}

export function toggleTeamRoomDialog(show, teamId = null) {
  return (dispatch) => {
    dispatch({ type: SHOW_TEAM_ROOM_DIALOG, payload: show });
    dispatch({ type: SET_CURRENT_DIALOG_TEAM_ID, payload: teamId });
  };
}
