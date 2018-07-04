import config from 'config/env';
import { doAuthenticatedRequest } from './urlRequest';

export const inviteNewSubscribers = (users, subscriberOrgId) => {
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/subscriberOrgs/inviteSubscribers/${subscriberOrgId}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { users, subscriberOrgId };

  return doAuthenticatedRequest({
    requestUrl,
    method: 'post',
    data: { userIdOrEmails: users }
  }, reduxState);
};

export const inviteMembersToTeam = (users, teamId) => {
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/teams/inviteMembers/${teamId}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { users, teamId };

  return doAuthenticatedRequest({
    requestUrl,
    method: 'post',
    data: { userIds: users }
  }, reduxState);
};

export const inviteMembersToTeamRoom = (users, teamRoomId) => {
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/teamRooms/inviteMembers/${teamRoomId}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { users, teamRoomId };

  return doAuthenticatedRequest({
    requestUrl,
    method: 'post',
    data: { userIds: users }
  }, reduxState);
};
