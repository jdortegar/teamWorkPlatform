import createCachedSelector from 're-reselect';
import { getReadMessagesByConversationId, getConversationIdsByTeamRoomId } from './state';

export { getReadMessagesByConversationId } from './state';

export const getReadMessagesOfConversationId = createCachedSelector(
  [getReadMessagesByConversationId, (state, conversationId) => conversationId],
  (readMessagesOfConversationId, conversationId) => readMessagesOfConversationId[conversationId]
)((state, conversationId) => conversationId);

export const getReadMessagesOfTeamRoomId = createCachedSelector(
  [getReadMessagesByConversationId, getConversationIdsByTeamRoomId, (state, teamRoomId) => teamRoomId],
  (readMessagesByConversationId, conversationIdsByTeamRoomId, teamRoomId) => {
    const conversationIds = conversationIdsByTeamRoomId[teamRoomId];
    return conversationIds && conversationIds.length > 0 ? readMessagesByConversationId[conversationIds[0]] : undefined;
  }
)((state, teamRoomId) => teamRoomId);

export const getUnreadMessagesCountOfTeamRoomId = createCachedSelector(
  [getReadMessagesOfTeamRoomId, (state, teamRoomId) => teamRoomId],
  readMessages => {
    if (!readMessages) return 0;
    return readMessages.messageCount - readMessages.lastReadMessageCount;
  }
)((state, teamRoomId) => teamRoomId);
