import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest } from './urlRequest';

export const inviteNewSubscribers = (users, subscriberOrgId) => {
  const requestUrl = buildApiUrl(`subscriberOrgs/inviteSubscribers/${subscriberOrgId}`);

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { users, subscriberOrgId };

  return doAuthenticatedRequest(
    {
      requestUrl,
      method: 'post',
      data: { userIdOrEmails: users }
    },
    reduxState
  );
};

export const inviteMembersToTeam = (users, teamId) => {
  const requestUrl = buildApiUrl(`teams/inviteMembers/${teamId}`);

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { users, teamId };

  return doAuthenticatedRequest(
    {
      requestUrl,
      method: 'post',
      data: { userIds: users }
    },
    reduxState
  );
};

export const inviteMembersToTeamRoom = (users, teamRoomId) => {
  const requestUrl = buildApiUrl(`teamRooms/inviteMembers/${teamRoomId}`);

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { users, teamRoomId };

  return doAuthenticatedRequest(
    {
      requestUrl,
      method: 'post',
      data: { userIds: users }
    },
    reduxState
  );
};
