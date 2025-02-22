import _ from 'lodash';
import {
  CONVERSATIONS_FETCH_SUCCESS,
  CONVERSATIONS_RECEIVE,
  TRANSCRIPT_FETCH_SUCCESS,
  MESSAGES_RECEIVE,
  MESSAGES_FETCH_SUCCESS
} from 'src/actions';

const INITIAL_STATE = {
  conversationById: {},
  conversationIdsByTeamId: {},
  transcriptByConversationId: {}
};

const defaultExpanded = true;

const getNodeFromFlattenedTree = (messageId, array) => {
  for (let i = array.length - 1; i >= 0; i -= 1) {
    const node = array[i];
    if (node.messageId === messageId) {
      return node;
    } else if (node.children.length > 0) {
      const childNode = getNodeFromFlattenedTree(messageId, node.children);
      if (childNode !== null) {
        return childNode;
      }
    }
  }
  return null;
};

const flattenedArrayMessage = message => ({
  messageId: message.messageId,
  created: message.created,
  children: [],
  expanded: defaultExpanded
});

const addMessageToArray = (message, array) => {
  if (array.length === 0) {
    array.push(flattenedArrayMessage(message));
  } else {
    let i = array.length - 1;
    for (; i >= 0; i -= 1) {
      if (message.created > array[i].created) {
        break;
      }
    }
    if (i < 0) {
      array.push(flattenedArrayMessage(message));
    } else {
      array.splice(i + 1, 0, flattenedArrayMessage(message));
    }
  }
};

const addMessageToFlattenedTree = (message, flattenedTree) => {
  if (message.replyTo) {
    const parentNode = getNodeFromFlattenedTree(message.replyTo, flattenedTree);
    if (parentNode === null) {
      return false;
    }
    addMessageToArray(message, parentNode.children);
  } else {
    addMessageToArray(message, flattenedTree);
  }

  return true;
};

const addMessagesToFlattenedTree = (messages, flattenedTree) => {
  const unaddedMessagesToFlattenedTree = [];
  messages.forEach(message => {
    if (!addMessageToFlattenedTree(message, flattenedTree)) {
      unaddedMessagesToFlattenedTree.push(message);
    }
  });

  // Only try to add if something else was added.
  if (unaddedMessagesToFlattenedTree.length > 0) {
    if (unaddedMessagesToFlattenedTree.length < messages.length) {
      addMessagesToFlattenedTree(unaddedMessagesToFlattenedTree, flattenedTree);
    } else {
      unaddedMessagesToFlattenedTree.forEach(message => {
        console.error(`Can't find parent ${message.replyTo} of messageId ${message.messageId}`); // eslint-disable-line no-console
      });
    }
  }
};

const addOrUpdateMessages = (messages, transcript) => {
  const mergedTranscript = transcript || { messages: {}, flattenedTree: [] };

  const unaddedMessagesToFlattenedTree = [];
  messages.forEach(message => {
    const existingMessage = mergedTranscript.messages[message.messageId];
    mergedTranscript.messages[message.messageId] = message;

    if (!existingMessage) {
      if (!addMessageToFlattenedTree(message, mergedTranscript.flattenedTree)) {
        unaddedMessagesToFlattenedTree.push(message);
      }
    }
  });

  if (unaddedMessagesToFlattenedTree.length > 0) {
    addMessagesToFlattenedTree(unaddedMessagesToFlattenedTree, mergedTranscript.flattenedTree);
  }

  return mergedTranscript;
};

const conversationsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CONVERSATIONS_FETCH_SUCCESS:
    case CONVERSATIONS_RECEIVE: {
      const { conversations } = action.payload;
      const conversationById = _.cloneDeep(state.conversationById);
      const conversationIdsByTeamId = _.cloneDeep(state.conversationIdsByTeamId);

      conversations.forEach(newConversation => {
        const conversation = _.cloneDeep(newConversation);
        if (conversation.participants) {
          const participants = conversation.participants.map(participant => participant.userId);
          conversation.participants = participants;
        }
        conversationById[conversation.conversationId] = conversation;
        let conversationIds = conversationIdsByTeamId[conversation.teamId];
        if (!conversationIds) {
          conversationIds = [];
          conversationIdsByTeamId[conversation.teamId] = conversationIds;
        }
        if (conversationIds.indexOf(conversation.conversationId) < 0) {
          conversationIds.push(conversation.conversationId);
        }
      });

      return {
        ...state,
        conversationById,
        conversationIdsByTeamId
      };
    }
    case TRANSCRIPT_FETCH_SUCCESS:
    case MESSAGES_RECEIVE: {
      const { conversationId, messages } = action.payload;
      const transcriptByConversationId = _.cloneDeep(state.transcriptByConversationId);
      transcriptByConversationId[conversationId] = addOrUpdateMessages(
        messages,
        transcriptByConversationId[conversationId]
      );

      return {
        ...state,
        transcriptByConversationId
      };
    }
    case MESSAGES_FETCH_SUCCESS: {
      const { messages } = action.payload;
      const transcriptByConversationId = _.cloneDeep(state.transcriptByConversationId);

      const conversationIdMessages = {};
      messages.forEach(message => {
        let conversationMessages = conversationIdMessages[message.conversationId];
        if (!conversationMessages) {
          conversationMessages = [message];
          conversationIdMessages[message.conversationId] = conversationMessages;
        } else {
          conversationMessages.push(message);
        }
      });

      Object.values(conversationIdMessages).forEach(conversationMessages => {
        const { conversationId } = conversationMessages[0];
        transcriptByConversationId[conversationId] = addOrUpdateMessages(
          conversationMessages,
          transcriptByConversationId[conversationId]
        );
      });

      return {
        ...state,
        transcriptByConversationId
      };
    }
    default:
      return state;
  }
};

export default conversationsReducer;
