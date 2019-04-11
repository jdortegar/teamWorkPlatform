import { createSelector } from 'reselect';
import { getTypingByUserIdsByConversationId } from './state';

export { getTypingByConversationIdsByUserId, getTypingByUserIdsByConversationId } from './state';

export const areConversationsLoaded = state => state.conversations.loaded;
export const getConversationsById = state => state.conversations.byId;
export const getConversationIds = state => state.conversations.allIds;
export const getConversationIdsByTeam = state => state.conversations.idsByTeam;
export const getConversationIdsByMember = state => state.conversations.idsByMember;
export const getMessagesByConversation = state => state.conversations.messagesByConversation;
export const getCurrentPersonalConversationId = state => state.conversations.currentPersonalConversationId;

export const getCurrentPersonalConversation = createSelector(
  [getConversationsById, getCurrentPersonalConversationId],
  (conversations, conversationId) => conversations[conversationId]
);

const buildConversation = (conversationId, conversations, messagesByConversation) => {
  if (!conversationId) return null;

  const conversation = conversations[conversationId];
  if (!conversation) return null;

  const { messagesList: messages = [] } = messagesByConversation[conversationId] || {};
  return { ...conversation, messages };
};

export const getConversation = createSelector(
  [getConversationsById, getMessagesByConversation, (state, conversationId) => conversationId],
  (conversations, messagesByConversation, conversationId) =>
    buildConversation(conversationId, conversations, messagesByConversation)
);

export const getTeamConversation = createSelector(
  [getConversationIdsByTeam, getConversationsById, getMessagesByConversation, (state, teamId) => teamId],
  (idsByTeam, conversations, messagesByConversation, teamId) =>
    buildConversation(idsByTeam[teamId], conversations, messagesByConversation)
);

export const getPersonalConversation = createSelector(
  [getConversationIdsByMember, getConversationsById, getMessagesByConversation, (state, userId) => userId],
  (idsByMember, conversations, messagesByConversation, userId) =>
    buildConversation(idsByMember[userId], conversations, messagesByConversation)
);

export const getMembersTyping = createSelector(
  [getTypingByUserIdsByConversationId, (state, conversationId) => conversationId],
  (typingByUserIdsByConversationId, conversationId) => typingByUserIdsByConversationId[conversationId]
);
