import { createSelector } from 'reselect';
import { getReadMessagesByConversationId } from './state';
import { getConversationsById, getConversationIdsByTeam } from './conversations';

export { getReadMessagesByConversationId } from './state';

export const getReadMessagesOfConversationId = createSelector(
  [getReadMessagesByConversationId, (state, conversationId) => conversationId],
  (readMessagesOfConversationId, conversationId) => readMessagesOfConversationId[conversationId]
);

export const getReadMessagesOfTeamId = createSelector(
  [getReadMessagesByConversationId, getConversationIdsByTeam, (state, teamId) => teamId],
  (readMessagesByConversationId, conversationIdsByTeam, teamId) => {
    const conversationIds = conversationIdsByTeam[teamId];
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

export const getLastReadTimestampOfConversationId = createSelector(
  [getReadMessagesOfConversationId, (state, conversationId) => conversationId],
  readMessages => {
    if (!readMessages) return null;
    return readMessages.lastReadTimestamp;
  }
);

export const getPersonalConversationUnreadMessages = createSelector(
  [getConversationsById, getReadMessagesByConversationId],
  (conversationById, readMessages) => {
    const personalConversationIds = Object.values(conversationById)
      .filter(conversation => !conversation.teamId)
      .map(conversation => conversation.conversationId);

    const personalConversationReadMessages = personalConversationIds.map(
      personalConversationId => readMessages[personalConversationId]
    );

    const personalConversationUnreadMessages = personalConversationReadMessages.reduce((acc, conversation) => {
      if (typeof conversation === 'undefined') return acc + 0;
      const unreadMessages = conversation.messageCount - (conversation.lastReadMessageCount || 0);
      return acc + (unreadMessages > 0 ? unreadMessages : 0);
    }, 0);

    return personalConversationUnreadMessages;
  }
);
