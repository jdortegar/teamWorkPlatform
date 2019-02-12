import { createSelector } from 'reselect';
import { getReadMessagesByConversationId, getConversationIdsByTeamId } from './state';

export { getReadMessagesByConversationId } from './state';

export const getReadMessagesOfConversationId = createSelector(
  [getReadMessagesByConversationId, (state, conversationId) => conversationId],
  (readMessagesOfConversationId, conversationId) => readMessagesOfConversationId[conversationId]
);

export const getReadMessagesOfTeamId = createSelector(
  [getReadMessagesByConversationId, getConversationIdsByTeamId, (state, teamId) => teamId],
  (readMessagesByConversationId, conversationIdsByTeamId, teamId) => {
    const conversationIds = conversationIdsByTeamId[teamId];
    return conversationIds && conversationIds.length > 0 ? readMessagesByConversationId[conversationIds[0]] : undefined;
  }
);

export const getUnreadMessagesCountOfTeamId = createSelector(
  [getReadMessagesOfTeamId, (state, teamId) => teamId],
  readMessages => {
    if (!readMessages) return 0;
    return readMessages.messageCount - (readMessages.lastReadMessageCount || 0);
  }
);

export const getUnreadMessagesCountOfConversationId = createSelector(
  [getReadMessagesOfConversationId, (state, conversationId) => conversationId],
  readMessages => {
    if (!readMessages) return 0;
    return readMessages.messageCount - (readMessages.lastReadMessageCount || 0);
  }
);
