import { SHOW_ORG_DIALOG, SHOW_INVITE_DIALOG, SHOW_ORG_SETTINGS_DIALOG } from './types';

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
