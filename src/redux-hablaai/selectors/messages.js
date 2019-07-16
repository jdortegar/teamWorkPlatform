import { createSelector } from 'reselect';
import buildMessagesList from 'src/lib/buildMessagesList';

export const getMessagesById = state => state.messages.byId;
export const getMessagesByConversation = state => state.messages.idsByConversation;
export const getPaginationByConversationId = state => state.messages.paginationByConversationId;
export const getLastMessageByConversationId = state => state.messages.lastMessagebyConversationId;

export const getMessages = createSelector(
  [getMessagesById, getMessagesByConversation, (state, conversationId) => conversationId],
  (messagesById, messagesByConversation, conversationId) => {
    const allIds = messagesByConversation[conversationId] || [];
    return buildMessagesList(allIds, messagesById);
  }
);

export const getCurrentPagination = createSelector(
  [getPaginationByConversationId, (state, conversationId) => conversationId],
  (paginationByConversationId, conversationId) => {
    return paginationByConversationId[conversationId];
  }
);

export const getLastMessage = createSelector(
  [getLastMessageByConversationId, (state, conversationId) => conversationId],
  (LastMessageByConversationId, conversationId) => {
    return LastMessageByConversationId[conversationId];
  }
);
