import axios from 'axios';
import config from '../config/env';
import { SHOW_ORG_DIALOG, SHOW_INVITE_DIALOG } from './types';

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
