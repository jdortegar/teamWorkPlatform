import { SUBMITTING_INVITE_ORG_FORM } from './types';

export const submitInviteOrgForm = (status) => { // eslint-disable-line import/prefer-default-export
  return {
    type: SUBMITTING_INVITE_ORG_FORM,
    payload: status
  };
};
