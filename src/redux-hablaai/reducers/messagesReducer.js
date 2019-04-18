import { combineReducers } from 'redux';
import { union, omit } from 'lodash';

import { MESSAGES_FETCH_SUCCESS, MESSAGE_CREATE_SUCCESS, MESSAGE_DELETE_SUCCESS, MESSAGE_RECEIVE } from 'src/actions';

const byId = (state = {}, action) => {
  switch (action.type) {
    case MESSAGES_FETCH_SUCCESS: {
      const { messages = [] } = action.payload;
      return {
        ...state,
        ...messages.reduce((acc, message) => ({ ...acc, [message.id]: message }), {})
      };
    }
    case MESSAGE_RECEIVE:
    case MESSAGE_CREATE_SUCCESS: {
      const { message } = action.payload;
      return { ...state, [message.id]: message };
    }
    case MESSAGE_DELETE_SUCCESS: {
      const { message } = action.payload;
      return omit(state, message.id);
    }
    default:
      return state;
  }
};

const idsByConversation = (state = {}, action) => {
  switch (action.type) {
    case MESSAGES_FETCH_SUCCESS: {
      const { messages = [] } = action.payload;
      return {
        ...state,
        ...messages.reduce(
          (acc, message) => ({
            ...acc,
            [message.conversationId]: union(acc[message.conversationId], [message.id])
          }),
          {}
        )
      };
    }
    case MESSAGE_RECEIVE:
    case MESSAGE_CREATE_SUCCESS: {
      const { message } = action.payload;
      return { ...state, [message.conversationId]: union(state[message.conversationId], [message.id]) };
    }
    case MESSAGE_DELETE_SUCCESS: {
      const { message } = action.payload;
      return { ...state, [message.conversationId]: state[message.conversationId].filter(item => item !== message.id) };
    }
    default:
      return state;
  }
};

const messagesReducer = combineReducers({ byId, idsByConversation });

export default messagesReducer;
