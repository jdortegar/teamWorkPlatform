export const getUserByUserId = state => state.users.userByUserId;

export const getPresencesByUserId = state => state.presences.presencesByUserId;

export const getSubscriberOrgById = state => state.subscriberOrgs.subscriberOrgById;
export const getCurrentSubscriberOrgId = state => state.subscriberOrgs.currentSubscriberOrgId;

export const getSubscriberUserIdBySubscriberOrgIdByUserId = state =>
  state.subscribers.subscriberUserIdBySubscriberOrgIdByUserId;
export const getUserIdsBySubscriberOrgId = state => state.subscribers.userIdsBySubscriberOrgId;

export const getTeamMemberIdByTeamIdByUserId = state => state.teamMembers.teamMemberIdByTeamIdByUserId;
export const getUserIdsByTeamId = state => state.teamMembers.byTeam;

export const getInvitations = state => state.invitations.invitations;
export const getDeclinedInvitations = state => state.invitations.declinedInvitations;

export const getRequests = state => state.requests.requests;
export const getResponseRequests = state => state.requests.responseRequests;

export const getTypingByConversationIdsByUserId = state => state.typings.typingByConversationIdsByUserId;
export const getTypingByUserIdsByConversationId = state => state.typings.typingByUserIdsByConversationId;
