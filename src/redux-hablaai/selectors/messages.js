import { createSelector } from 'reselect';
import buildMessagesList from 'src/lib/buildMessagesList';

export const getMessagesById = state => state.messages.byId;
export const getMessagesByConversation = state => state.messages.idsByConversation;

export const getMessages = createSelector(
  [getMessagesById, getMessagesByConversation, (state, conversationId) => conversationId],
  (messagesById, messagesByConversation, conversationId) => {
    const allIds = messagesByConversation[conversationId] || [];
    return buildMessagesList(allIds, messagesById);
  }
);
