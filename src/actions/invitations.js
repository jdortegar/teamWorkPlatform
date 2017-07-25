import axios from 'axios';
import config from '../config/env';
import { getJwt } from '../session';
import { SUBMITTING_INVITE_ORG_FORM } from './types';

export function inviteUser(users, susbcriberOrg) {
  const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };

  return axios.post(`${config.hablaApiBaseUri}/subscriberOrgs/inviteSubscribers/${susbcriberOrg}`, { userIdOrEmails: users }, axiosOptions);
}

export function submitInviteOrgForm(status) {
  return {
    type: SUBMITTING_INVITE_ORG_FORM,
    payload: status
  };
}
