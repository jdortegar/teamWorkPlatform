import _ from 'lodash';
import createCachedSelector from 're-reselect';
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

export const getConversationOfTeamId = createCachedSelector(
  [getConversationIdsByTeamId, getConversationById, getTranscriptByConversationId, (state, teamId) => teamId],
  (conversationIdsByTeamId, conversationById, transcriptByConversationId, teamId) => {
    const conversationIds = conversationIdsByTeamId[teamId];
    if (!conversationIds || conversationIds.length === 0) {
      return null;
    }

    // Only 1 conversation per team room, currently.
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
)((state, teamId) => teamId);

export const getTypingsOfConversationId = createCachedSelector(
  [getTypingByUserIdsByConversationId, (state, conversationId) => conversationId],
  (typingByUserIdsByConversationId, conversationId) => typingByUserIdsByConversationId[conversationId]
)((state, conversationId) => conversationId);
