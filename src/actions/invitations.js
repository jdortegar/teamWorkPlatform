import { SUBMITTING_INVITE_ORG_FORM } from './types';

export function submitInviteOrgForm(status) {
  return {
    type: SUBMITTING_INVITE_ORG_FORM,
    payload: status
  };
}
