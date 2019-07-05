import { combineReducers } from 'redux';
import { union, omit } from 'lodash';

import {
  MESSAGES_FETCH_SUCCESS,
  MESSAGE_CREATE_SUCCESS,
  MESSAGE_UPDATE_SUCCESS,
  MESSAGE_DELETE_SUCCESS,
  MESSAGES_READ_SUCCESS,
  MESSAGE_RECEIVE,
  MESSAGE_DELETED,
  BOOKMARKS_FETCH_SUCCESS
} from 'src/actions';

const byId = (state = {}, action) => {
  switch (action.type) {
    case MESSAGES_FETCH_SUCCESS: {
      const { messages = [] } = action.payload;
      return messages.reduce((acc, message) => ({ ...acc, [message.id]: message }), state);
    }
    case MESSAGE_RECEIVE:
    case MESSAGE_CREATE_SUCCESS:
    case MESSAGE_UPDATE_SUCCESS: {
      const { message } = action.payload;
      return { ...state, [message.id]: message };
    }
    case MESSAGE_DELETED:
    case MESSAGE_DELETE_SUCCESS: {
      const { message } = action.payload;
      return omit(state, message.id);
    }
    case MESSAGES_READ_SUCCESS: {
      const { messageIds = [], currentUserId } = action.payload;
      return messageIds.reduce((acc, id) => {
        const message = state[id];
        if (!message) return acc;
        return { ...acc, [id]: { ...message, readBy: union(message.readBy, [currentUserId]) } };
      }, state);
    }
    case BOOKMARKS_FETCH_SUCCESS: {
      const { bookmarks = [] } = action.payload;
      return bookmarks.reduce((acc, { message }) => {
        if (!message) return acc;
        return { ...acc, [message.id]: message };
      }, state);
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
    case MESSAGE_DELETED:
    case MESSAGE_DELETE_SUCCESS: {
      const { message } = action.payload;
      return { ...state, [message.conversationId]: state[message.conversationId].filter(item => item !== message.id) };
    }
    case BOOKMARKS_FETCH_SUCCESS: {
      const { bookmarks = [] } = action.payload;
      return {
        ...state,
        ...bookmarks.reduce((acc, { message }) => {
          if (!message) return acc;
          return { ...acc, [message.conversationId]: union(acc[message.conversationId], [message.id]) };
        }, state)
      };
    }
    default:
      return state;
  }
};

const messagesReducer = combineReducers({ byId, idsByConversation });

export default messagesReducer;
