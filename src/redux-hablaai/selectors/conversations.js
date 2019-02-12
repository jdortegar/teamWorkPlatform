import _ from 'lodash';
import { createSelector } from 'reselect';
import {
  getConversationById,
  getConversationIdsByTeamId,
  getTranscriptByConversationId,
  getTypingByUserIdsByConversationId
} from './state';

export {
  getConversationById,
  getConversationIdsByTeamId,
  getTranscriptByConversationId,
  getTypingByConversationIdsByUserId,
  getTypingByUserIdsByConversationId
} from './state';

function merge(tree, messages) {
  const ret = [];
  tree.forEach(node => {
    const merged = _.merge({}, messages[node.messageId], node);
    ret.push(merged);
    if (node.children.length > 0) {
      merged.children = merge(node.children, messages);
    }
  });
  return ret;
}

export const getConversationOfTeamId = createSelector(
  [getConversationIdsByTeamId, getConversationById, getTranscriptByConversationId, (state, teamId) => teamId],
  (conversationIdsByTeamId, conversationById, transcriptByConversationId, teamId) => {
    const conversationIds = conversationIdsByTeamId[teamId];
    if (!conversationIds || conversationIds.length === 0) {
      return null;
    }

    // Only 1 conversation per team, currently.
    const conversation = conversationById[conversationIds[0]];
    const transcript = transcriptByConversationId[conversationIds[0]];

    if (!conversation) {
      return null;
    }

    const conversationClone = _.cloneDeep(conversation);
    if (!transcript) {
      conversationClone.transcript = [];
      return conversationClone;
    }

    conversationClone.transcript = merge(transcript.flattenedTree, transcript.messages);
    return conversationClone;
  }
);

export const getTypingsOfConversationId = createSelector(
  [getTypingByUserIdsByConversationId, (state, conversationId) => conversationId],
  (typingByUserIdsByConversationId, conversationId) => typingByUserIdsByConversationId[conversationId]
);

export const getCurrentPersonalConversation = state => state.conversations.currentPersonalConversation;

export const getConversationOfConversationId = createSelector(
  [getConversationById, getTranscriptByConversationId, getCurrentPersonalConversation],
  (conversationById, transcriptByConversationId, currentPersonalConversation) => {
    if (!currentPersonalConversation) return null;

    const conversationIds = currentPersonalConversation.conversationId;
    if (!conversationIds || conversationIds.length === 0) {
      return null;
    }

    // Only 1 conversation per team, currently.
    const conversation = conversationById[conversationIds];
    const transcript = transcriptByConversationId[conversationIds];

    if (!conversation) {
      return null;
    }

    const conversationClone = _.cloneDeep(conversation);
    if (!transcript) {
      conversationClone.transcript = [];
      return conversationClone;
    }

    conversationClone.transcript = merge(transcript.flattenedTree, transcript.messages);
    return conversationClone;
  }
);
