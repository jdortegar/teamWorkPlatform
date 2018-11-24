import createCachedSelector from 're-reselect';
import { getReadMessagesByConversationId, getConversationIdsByTeamId } from './state';

export { getReadMessagesByConversationId } from './state';

export const getReadMessagesOfConversationId = createCachedSelector(
  [getReadMessagesByConversationId, (state, conversationId) => conversationId],
  (readMessagesOfConversationId, conversationId) => readMessagesOfConversationId[conversationId]
)((state, conversationId) => conversationId);

export const getReadMessagesOfTeamId = createCachedSelector(
  [getReadMessagesByConversationId, getConversationIdsByTeamId, (state, teamId) => teamId],
  (readMessagesByConversationId, conversationIdsByTeamId, teamId) => {
    const conversationIds = conversationIdsByTeamId[teamId];
    return conversationIds && conversationIds.length > 0 ? readMessagesByConversationId[conversationIds[0]] : undefined;
  }
)((state, teamId) => teamId);

export const getUnreadMessagesCountOfTeamId = createCachedSelector(
  [getReadMessagesOfTeamId, (state, teamId) => teamId],
  readMessages => {
    if (!readMessages) return 0;
    return readMessages.messageCount - readMessages.lastReadMessageCount;
  }
)((state, teamId) => teamId);
