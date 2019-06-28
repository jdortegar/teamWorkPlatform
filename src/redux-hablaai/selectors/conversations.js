import { createSelector } from 'reselect';
import { getTypingByUserIdsByConversationId } from './state';
import { getMessages, getMessagesByConversation } from './messages';
import { getCurrentUserId } from './auth';

export { getTypingByConversationIdsByUserId, getTypingByUserIdsByConversationId } from './state';

export const areConversationsLoaded = state => state.conversations.loaded;
export const getConversationsById = state => state.conversations.byId;
export const getConversationIds = state => state.conversations.allIds;
export const getConversationIdsByTeam = state => state.conversations.idsByTeam;
export const getConversationIdsByMember = state => state.conversations.idsByMember;

const buildConversation = (conversationId, conversations, state) => {
  if (!conversationId) return null;

  const conversation = conversations[conversationId];
  if (!conversation) return null;

  const messages = getMessages(state, conversationId);
  return { ...conversation, messages };
};

export const getConversation = createSelector(
  [getConversationsById, (state, conversationId) => conversationId],
  (conversations, conversationId) => conversations[conversationId]
);

export const getConversationWithMessages = createSelector(
  [getConversationsById, getMessagesByConversation, (state, conversationId) => ({ state, conversationId })],
  (conversations, messagesByConversation, { state, conversationId }) =>
    buildConversation(conversationId, conversations, state)
);

export const getTeamConversation = createSelector(
  [getConversationIdsByTeam, getConversationsById, getMessagesByConversation, (state, teamId) => ({ state, teamId })],
  (idsByTeam, conversations, messagesByConversation, { state, teamId }) =>
    buildConversation(idsByTeam[teamId], conversations, state)
);

export const getPersonalConversation = createSelector(
  [getConversationIdsByMember, getConversationsById, (state, userId) => ({ state, userId })],
  (idsByMember, conversations, { state, userId }) => buildConversation(idsByMember[userId], conversations, state)
);

export const getConversationLink = createSelector(
  [getConversationsById, getCurrentUserId, (state, conversationId) => conversationId],
  (conversations, currentUserId, conversationId) => {
    const conversation = conversations[conversationId];
    if (!conversation) return '';
    const { appData = {}, members = [] } = conversation;

    if (appData.teamId) return `/app/team/${appData.teamId}`;

    const userId = members.find(u => u !== currentUserId);
    return `/app/chat/${userId}`;
  }
);

export const getMembersTyping = createSelector(
  [getTypingByUserIdsByConversationId, (state, conversationId) => conversationId],
  (typingByUserIdsByConversationId, conversationId) => typingByUserIdsByConversationId[conversationId]
);
