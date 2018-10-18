import createCachedSelector from 're-reselect';

export const getUrlRequests = state => state.urlRequests;

export const getUserByUserId = state => state.users.userByUserId;

export const getPresencesByUserId = state => state.presences.presencesByUserId;

export const getSubscriberOrgById = state => state.subscriberOrgs.subscriberOrgById;
export const getCurrentSubscriberOrgId = state => state.subscriberOrgs.currentSubscriberOrgId;

export const getSubscriberUserIdBySubscriberOrgIdByUserId = state =>
  state.subscribers.subscriberUserIdBySubscriberOrgIdByUserId;
export const getUserIdsBySubscriberOrgId = state => state.subscribers.userIdsBySubscriberOrgId;

export const getTeamMemberIdByTeamIdByUserId = state => state.teamMembers.teamMemberIdByTeamIdByUserId;
export const getUserIdsByTeamId = state => state.teamMembers.userIdsByTeamId;

export const getInvitations = state => state.invitations.invitations;
export const getDeclinedInvitations = state => state.invitations.declinedInvitations;

export const getConversationById = state => state.conversations.conversationById;
export const getConversationIdsByTeamRoomId = state => state.conversations.conversationIdsByTeamRoomId;
export const getTranscriptByConversationId = state => state.conversations.transcriptByConversationId;
export const getReadMessagesByConversationId = state => state.readMessages.readMessagesByConversationId;

export const getTypingByConversationIdsByUserId = state => state.typings.typingByConversationIdsByUserId;
export const getTypingByUserIdsByConversationId = state => state.typings.typingByUserIdsByConversationId;

export const getIntegrationsBySubscriberOrgId = state => state.integrations.integrationsBySubscriberOrgId;

export const getUrlRequestStatus = createCachedSelector(
  [getUrlRequests, (state, requestUrl) => requestUrl],
  (urlRequests, requestUrl) => urlRequests[requestUrl]
)((state, requestUrl) => requestUrl);

export const getIntegrationsByTeamId = state => state.integrations.integrationsByTeamId;
