import _ from 'lodash';
import {
  REQUESTING_CONVERSATIONS,
  RECEIVE_CONVERSATIONS,
  REQUEST_CONVERSATIONS_ERROR,
  REQUESTING_TRANSCRIPT,
  RECEIVE_TRANSCRIPT,
  RECEIVE_MESSAGES,
  REQUEST_TRANSCRIPT_ERROR,
  SET_ACTIVE_CONVERSATION
} from '../actions/types';

const INITIAL_STATE = {
  conversationById: {},
  conversationIdsByTeamRoomId: {},
  activeConversationId: null,

  working: false,
  error: null,
  errorMeta: {}
};

const defaultExpanded = true;

function getNodeFromFlattenedTree(messageId, array) {
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
}

function flattenedArrayMessage(message) {
  return { messageId: message.messageId, created: message.created, children: [], expanded: defaultExpanded };
}

function addMessageToArray(message, array) {
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
}

function addMessageToFlattenedTree(message, flattenedTree) {
  if (message.replyTo) {
    const parentNode = getNodeFromFlattenedTree(message.messageId, flattenedTree);
    if (parentNode === null) {
      return false;
    }
  } else {
    addMessageToArray(message, flattenedTree);
  }

  return true;
}

function addMessagesToFlattenedTree(messages, flattenedTree) {
  const unaddedMessagesToFlattenedTree = [];
  messages.forEach((message) => {
    if (!addMessageToFlattenedTree(message, flattenedTree)) {
      unaddedMessagesToFlattenedTree.push(message);
    }
  });

  // Only try to add if something else was added.
  if (unaddedMessagesToFlattenedTree.length > 0) {
    if (unaddedMessagesToFlattenedTree.length < messages.length) {
      addMessagesToFlattenedTree(unaddedMessagesToFlattenedTree, flattenedTree);
    } else {
      unaddedMessagesToFlattenedTree.forEach((message) => {
        console.error(`Can't find parent ${message.replyTo} of messageId ${message.messageId}`);
      });
    }
  }
}


function addOrUpdateMessages(messages, transcript) {
  const mergedTranscript = transcript || { messages: {}, flattenedTree: [] };

  const unaddedMessagesToFlattenedTree = [];
  messages.forEach((message) => {
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
}


const conversationsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REQUESTING_CONVERSATIONS:
    case REQUESTING_TRANSCRIPT:
      return {
        ...state,
        working: true,
        error: null,
        errorMeta: {}
      };
    case RECEIVE_CONVERSATIONS: {
      const { teamRoomId, conversations } = action.payload;
      let updateConversationIdsByTeamRoomId = state.conversationIdsByTeamRoomId;

      if (teamRoomId) {
        updateConversationIdsByTeamRoomId = _.cloneDeep(state.conversationIdsByTeamRoomId);
        const conversationIds = [];
        conversations.forEach(conversation => conversationIds.push(conversation.conversationId));
        updateConversationIdsByTeamRoomId[teamRoomId] = conversationIds;
      }

      const updateConversationById = _.cloneDeep(state.conversationById);
      conversations.forEach((conversation) => {
        if (updateConversationById[conversation.conversationId]) {
          const updateConversation = updateConversationById[conversation.conversationId];
          updateConversation.participants = conversation.participants;
          if (conversation.teamRoomId) {
            updateConversation.teamRoomId = conversation.teamRoomId;
          } else {
            delete updateConversation.teamRoomId;
          }
          updateConversationById[conversation.conversationId] = updateConversation;
        } else {
          updateConversationById[conversation.conversationId] = conversation;
        }
      });

      return {
        ...state,
        conversationById: updateConversationById,
        conversationIdsByTeamRoomId: updateConversationIdsByTeamRoomId,
        working: false,
        error: null,
        errorMeta: {}
      };
    }
    case RECEIVE_TRANSCRIPT: {
      const { conversationId, transcript } = action.payload;
      const updateConversations = _.cloneDeep(state.conversationById);

      const conversation = updateConversations[conversationId] || {};
      conversation.transcript = addOrUpdateMessages(transcript);
      updateConversations[conversationId] = conversation;

      return {
        ...state,
        conversationById: updateConversations,
        working: false,
        error: null,
        errorMeta: {}
      };
    }
    case RECEIVE_MESSAGES: {
      const { conversationId, transcript } = action.payload;
      const updateConversations = _.cloneDeep(state.conversationById);

      const conversation = updateConversations[conversationId] || {};
      const { transcript: existingTranscript } = conversation;
      conversation.transcript = addOrUpdateMessages(transcript, existingTranscript);
      updateConversations[conversationId] = conversation;

      return {
        ...state,
        conversationById: updateConversations,
        working: false,
        error: null,
        errorMeta: {}
      };
    }
    case REQUEST_CONVERSATIONS_ERROR:
    case REQUEST_TRANSCRIPT_ERROR:
      return {
        ...state,
        working: false,
        error: action.payload,
        errorMeta: action.meta || {}
      };
    case SET_ACTIVE_CONVERSATION: {
      const { conversationId } = action.payload;
      return {
        ...state,
        activeConversationId: conversationId
      };
    }
    default:
      return state;
  }
};

export default conversationsReducer;
