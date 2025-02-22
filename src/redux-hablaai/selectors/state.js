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

export const getConversationById = state => state.conversations.conversationById;
export const getConversationIdsByTeamId = state => state.conversations.conversationIdsByTeamId;
export const getTranscriptByConversationId = state => state.conversations.transcriptByConversationId;
export const getReadMessagesByConversationId = state => state.readMessages.readMessagesByConversationId;

export const getTypingByConversationIdsByUserId = state => state.typings.typingByConversationIdsByUserId;
export const getTypingByUserIdsByConversationId = state => state.typings.typingByUserIdsByConversationId;
