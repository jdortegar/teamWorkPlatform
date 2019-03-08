import { createSelector } from 'reselect';
import { getTypingByUserIdsByConversationId } from './state';

export { getTypingByConversationIdsByUserId, getTypingByUserIdsByConversationId } from './state';

export const getConversationsById = state => state.conversations.byId;
export const getConversationIds = state => state.conversations.allIds;
export const getConversationIdsByTeam = state => state.conversations.idsByTeam;
export const getMessagesByConversation = state => state.conversations.messagesByConversation;
export const getCurrentPersonalConversationId = state => state.conversations.currentPersonalConversationId;

export const getCurrentPersonalConversation = createSelector(
  [getConversationsById, getCurrentPersonalConversationId],
  (conversations, conversationId) => conversations[conversationId]
);

const getConversation = (conversationId, conversations, messagesByConversation) => {
  if (!conversationId) return null;

  const conversation = conversations[conversationId];
  if (!conversation) return null;

  const { messagesList: messages = [] } = messagesByConversation[conversationId] || {};
  return { ...conversation, messages };
};

export const getTeamConversation = createSelector(
  [getConversationIdsByTeam, getConversationsById, getMessagesByConversation, (state, teamId) => teamId],
  (idsByTeam, conversations, messagesByConversation, teamId) => {
    // Only 1 conversation per team, currently.
    const [conversationId] = idsByTeam[teamId] || [];
    return getConversation(conversationId, conversations, messagesByConversation);
  }
);

export const getPersonalConversation = createSelector(
  [getCurrentPersonalConversationId, getConversationsById, getMessagesByConversation],
  getConversation
);

export const getMembersTyping = createSelector(
  [getTypingByUserIdsByConversationId, (state, conversationId) => conversationId],
  (typingByUserIdsByConversationId, conversationId) => typingByUserIdsByConversationId[conversationId]
);
