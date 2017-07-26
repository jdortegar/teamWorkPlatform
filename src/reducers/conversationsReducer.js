import _ from 'lodash';
import {
  REQUESTING_CONVERSATIONS,
  RECEIVE_CONVERSATIONS,
  REQUEST_CONVERSATIONS_ERROR,
  REQUESTING_TRANSCRIPT,
  RECEIVE_TRANSCRIPT,
  REQUEST_TRANSCRIPT_ERROR,
  SET_ACTIVE_CONVERSATION
} from '../actions/types';

const INITIAL_STATE = {
  conversationById: {},
  conversationIdsByTeamRoomId: {},
  activeConversationId: null,

  received: false,
  requesting: false,
  error: null
};

const defaultExpanded = true;

function addMessages(messages, transcript) {
  const mergedTranscript = transcript || { messages: {}, flattenedTree: {} };

  messages.forEach((message) => {
    mergedTranscript.messages[message.messageId] = message;

    if (message.replyTo) {
      let parent = mergedTranscript.flattenedTree[message.replyTo];
      if (!parent) {
        parent = { expanded: defaultExpanded, children: [] };
        mergedTranscript.flattenedTree[message.replyTo] = parent;
      }
      parent.children.push(message.messageId);
    } else {
      const existing = mergedTranscript.flattenedTree[message.messageId];
      if (!existing) {
        mergedTranscript.flattenedTree[message.messageId] = { expanded: defaultExpanded, children: [] };
      }
    }
  });

  return mergedTranscript;
}


const conversationsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REQUESTING_CONVERSATIONS:
    case REQUESTING_TRANSCRIPT:
      return {
        ...state,
        received: false,
        requesting: true,
        error: null
      };
    case RECEIVE_CONVERSATIONS: {
      const { teamRoomId, conversations } = action.payload;
      let updateConversationIdsByTeamRoomId = state.conversationIdsByTeamRoomId;

      if (teamRoomId) {
        updateConversationIdsByTeamRoomId = _.cloneDeep(state.conversationIdsByTeamRoomId);
        const conversationIds = [];
        conversations.forEach(conversation => conversationIds.push(conversation.conversationId));
        updateConversationIdsByTeamRoomId[teamRoomId] = { conversationIds };
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
        received: true,
        requesting: false,
        error: null
      };
    }
    case RECEIVE_TRANSCRIPT: {
      const { conversationId, transcript } = action.payload;
      const updateConversations = _.cloneDeep(state.conversations);


      const conversation = updateConversations[conversationId] || {};
      const { transcript: existingTranscript } = conversation;
      conversation.transcript = addMessages(transcript, existingTranscript);
      updateConversations[conversationId] = conversation;

      return {
        ...state,
        conversationById: updateConversations,
        received: true,
        requesting: false,
        error: null
      };
    }
    case REQUEST_CONVERSATIONS_ERROR:
    case REQUEST_TRANSCRIPT_ERROR:
      return {
        ...state,
        received: false,
        requesting: false,
        error: action.payload
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
