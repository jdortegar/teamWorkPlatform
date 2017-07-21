import { reset } from 'redux-form';
import {
  SHOW_TEAM_DIALOG,
  SHOW_ORG_DIALOG,
  SHOW_INVITE_DIALOG
} from './types';

export function toggleInviteDialog(showDialog) {
  return (dispatch) => {
    dispatch({ type: SHOW_INVITE_DIALOG, payload: showDialog });
    dispatch(reset('inviteDialog'));
  };
}

export function toggleTeamDialog(showDialog) {
  return (dispatch) => {
    dispatch({ type: SHOW_TEAM_DIALOG, payload: showDialog });
    dispatch(reset('teamDialog'));
  };
}

export function toggleOrgDialog(showDialog) {
  return (dispatch) => {
    dispatch({ type: SHOW_ORG_DIALOG, payload: showDialog });
    dispatch(reset('orgDialog'));
  };
}
