import axios from 'axios';
import { SUBMITTING_INVITE_ORG_FORM } from './types';
import config from '../config/env';
import { getJwt } from '../session';

export function submitInviteOrgForm(status) {
  return {
    type: SUBMITTING_INVITE_ORG_FORM,
    payload: status
  };
}

export function inviteNewMembers(users, subscriberOrgId) {
  const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };

  return () => {
    return axios.post(`${config.hablaApiBaseUri}/subscriberOrgs/inviteSubscribers/${subscriberOrgId}`, { userIdOrEmails: users }, axiosOptions)
      .then(response => response.data.integrations);
  };
}
