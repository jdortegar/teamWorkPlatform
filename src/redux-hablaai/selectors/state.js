import createCachedSelector from 're-reselect';

export const getUrlRequests = state => state.urlRequests;

export const getUserByUserId = state => state.users.userByUserId;
export const getMyselfUserId = state => state.users.myselfUserId;

export const getPresencesByUserId = state => state.presences.presencesByUserId;

export const getSubscriberOrgById = state => state.subscriberOrgs.subscriberOrgById;
export const getCurrentSubscriberOrgId = state => state.subscriberOrgs.currentSubscriberOrgId;

export const getSubscriberUserIdByUserId = state => state.subscribers.subscriberUserIdByUserId;
export const getUserIdsBySubscriberOrgId = state => state.subscribers.userIdsBySubscriberOrgId;

export const getTeamById = state => state.teams.teamById;
export const getTeamIdsBySubscriberOrgId = state => state.teams.teamIdsBySubscriberOrgId;

export const getTeamMemberIdByUserId = state => state.teamMembers.teamMemberIdByUserId;
export const getUserIdsByTeamId = state => state.teamMembers.userIdsByTeamId;

export const getTeamRoomById = state => state.teamRooms.teamRoomById;
export const getTeamRoomIdsByTeamId = state => state.teamRooms.teamRoomIdsByTeamId;

export const getTeamRoomMemberIdByUserId = state => state.teamRoomMembers.teamRoomMemberIdByUserId;
export const getUserIdsByTeamRoomId = state => state.teamRoomMembers.userIdsByTeamRoomId;

export const getInvitations = state => state.invitations.invitations;

export const getConversationById = state => state.conversations.conversationById;
export const getConversationIdsByTeamRoomId = state => state.conversations.conversationIdsByTeamRoomId;
export const geTranscriptByConversationId = state => state.conversations.transcriptByConversationId;

export const getTypingByConversationIdsByUserId = state => state.typings.typingByConversationIdsByUserId;
export const getTypingByUserIdsByConversationId = state => state.typings.typingByUserIdsByConversationId;

export const getUrlRequestStatus = createCachedSelector(
  [getUrlRequests, (state, requestUrl) => requestUrl],
  (urlRequests, requestUrl) => {
    return urlRequests[requestUrl];
  }
)(
  (state, requestUrl) => requestUrl
);
