import { combineReducers } from 'redux';
import { union, omit } from 'lodash';
import {
  CONVERSATIONS_FETCH_SUCCESS,
  CONVERSATIONS_RECEIVE,
  MESSAGES_RECEIVE,
  MESSAGES_FETCH_SUCCESS,
  MESSAGE_CREATE_REQUEST,
  MESSAGE_CREATE_SUCCESS,
  MESSAGE_CREATE_FAILURE,
  CONVERSATION_DIRECT_RECEIVE
} from 'src/actions';
import buildMessagesList from 'src/lib/buildMessagesList';

const byId = (state = {}, action) => {
  switch (action.type) {
    case CONVERSATIONS_FETCH_SUCCESS:
    case CONVERSATIONS_RECEIVE: {
      const { conversations = [] } = action.payload;
      return {
        ...state,
        ...conversations.reduce((acc, conversation) => {
          const participants = conversation.participants.map(({ userId }) => userId);
          acc[conversation.conversationId] = { ...conversation, participants };
          return acc;
        }, {})
      };
    }
    case CONVERSATION_DIRECT_RECEIVE: {
      const { conversation } = action.payload;
      if (!conversation) return state;
      return {
        ...state,
        [conversation.conversationId]: conversation
      };
    }
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case CONVERSATIONS_FETCH_SUCCESS:
    case CONVERSATIONS_RECEIVE: {
      const { conversations = [] } = action.payload;
      return union(state, conversations.map(({ conversationId }) => conversationId));
    }
    case CONVERSATION_DIRECT_RECEIVE: {
      const { conversation } = action.payload;
      if (!conversation) return state;
      return union(state, [conversation.conversationId]);
    }
    default:
      return state;
  }
};

const idsByTeam = (state = {}, action) => {
  switch (action.type) {
    case CONVERSATIONS_FETCH_SUCCESS:
    case CONVERSATIONS_RECEIVE: {
      const { conversations = [] } = action.payload;
      return {
        ...state,
        ...conversations.reduce((acc, conversation) => {
          if (!conversation.teamId) return acc;
          acc[conversation.teamId] = union(acc[conversation.teamId], [conversation.conversationId]);
          return acc;
        }, {})
      };
    }
    default:
      return state;
  }
};

const currentPersonalConversationId = (state = null, action) => {
  switch (action.type) {
    case CONVERSATION_DIRECT_RECEIVE: {
      const { conversation = {} } = action.payload;
      return conversation && conversation.conversationId;
    }
    default:
      return state;
  }
};

const messagesByConversation = (state = {}, action) => {
  switch (action.type) {
    case MESSAGES_FETCH_SUCCESS:
    case MESSAGES_RECEIVE: {
      const { conversationId, messages = [] } = action.payload;
      return { ...state, [conversationId]: buildMessagesList(messages, state[conversationId]) };
    }
    case MESSAGE_CREATE_REQUEST: {
      const { conversationId, message } = action.payload;
      return { ...state, [conversationId]: buildMessagesList([message], state[conversationId]) };
    }
    case MESSAGE_CREATE_SUCCESS: {
      const { conversationId, localId, message } = action.payload;
      const updatedMessage = { ...message, localId };
      return { ...state, [conversationId]: buildMessagesList([updatedMessage], state[conversationId]) };
    }
    case MESSAGE_CREATE_FAILURE: {
      const { conversationId, localId } = action.payload;
      const current = state[conversationId] || {};

      return {
        ...state,
        [conversationId]: {
          byId: omit(current.byId, localId),
          messagesList: current.messagesList.filter(m => m.localId !== localId)
        }
      };
    }
    default:
      return state;
  }
};

const conversationsReducer = combineReducers({
  byId,
  allIds,
  idsByTeam,
  messagesByConversation,
  currentPersonalConversationId
});

export default conversationsReducer;
