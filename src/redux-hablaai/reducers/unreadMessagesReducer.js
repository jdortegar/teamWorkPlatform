import { combineReducers } from 'redux';

import {
  CONVERSATIONS_RECEIVE,
  CONVERSATIONS_FETCH_SUCCESS,
  CONVERSATIONS_CREATE_SUCCESS,
  MESSAGES_FETCH_SUCCESS,
  MESSAGE_RECEIVE
} from 'src/actions';

const byConversation = (state = {}, action) => {
  switch (action.type) {
    case CONVERSATIONS_RECEIVE:
    case CONVERSATIONS_FETCH_SUCCESS: {
      // TODO: uncomment when this field returns the correct data from the API
      // const { conversations = [] } = action.payload;
      return {
        ...state
        // ...conversations.reduce((acc, { id, unreadMessages = 0 }) => ({ ...acc, [id]: unreadMessages }), state)
      };
    }
    case CONVERSATIONS_CREATE_SUCCESS: {
      const { conversation = {} } = action.payload;
      if (!conversation.id) return state;
      return { ...state, [conversation.id]: conversation.unreadMessages || 0 };
    }
    case MESSAGES_FETCH_SUCCESS: {
      const { messages = [], currentUserId } = action.payload;
      const [{ conversationId }] = messages; // all messages here belong to the same conversation
      if (!conversationId) return state;

      const unreadMessages = messages.reduce((total, { readBy = [] }) => {
        if (readBy.includes(currentUserId)) return total;
        return total + 1;
      }, 0);
      return { ...state, [conversationId]: unreadMessages };
    }
    case MESSAGE_RECEIVE: {
      const { message, currentUserId } = action.payload;
      if (message.readBy.includes(currentUserId)) return state;
      return { ...state, [message.conversationId]: state[message.conversationId] + 1 };
    }
    default:
      return state;
  }
};

const unreadMessagesReducer = combineReducers({ byConversation });

export default unreadMessagesReducer;
