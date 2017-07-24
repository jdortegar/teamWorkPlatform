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
  data: { conversations: {}, teamRoomIds: {} },
  received: false,
  requesting: false,
  error: null,
  activeConversationId: null
};

const defaultExpanded = true;

function addMessages(messages, transcript) {
  const mergedTranscript = transcript || { messages: {}, flattenedTree: {} };

  messages.forEach((message) => {
    mergedTranscript.messages[message.messageId] = message;

    if (message.replyTo) {
      let parent = this.flattenedTree[message.replyTo];
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
      const stateData = _.cloneDeep(state.data);

      if (teamRoomId) {
        const conversationIds = [];
        conversations.forEach(conversation => conversationIds.push(conversation.conversationId));
        stateData.teamRoomIds[teamRoomId] = { conversationIds };
      }

      conversations.forEach((conversation) => {
        if (stateData.conversations[conversation.conversationId]) {
          const stateDataConversation = stateData.conversations[conversation.conversationId];
          stateDataConversation.participants = conversation.participants;
          if (conversation.teamRoomId) {
            stateDataConversation.teamRoomId = conversation.teamRoomId;
          } else {
            delete stateDataConversation.teamRoomId;
          }
        } else {
          stateData.conversations[conversation.conversationId] = conversation;
        }
      });

      return {
        ...state,
        data: stateData,
        received: true,
        requesting: false,
        error: null
      };
    }
    case RECEIVE_TRANSCRIPT: {
      const { conversationId, transcript } = action.payload;
      const stateData = _.cloneDeep(state.data);

      const conversation = stateData.conversations[conversationId] || {};
      const { transcript: existingTranscript } = conversation;
      conversation.transcript = addMessages(transcript, existingTranscript);
      stateData.conversations[conversationId] = conversation;

      return {
        ...state,
        data: stateData,
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
