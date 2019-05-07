import { combineReducers } from 'redux';

import { CONVERSATIONS_FETCH_SUCCESS } from 'src/actions';

const byConversation = (state = {}, action) => {
  switch (action.type) {
    case CONVERSATIONS_FETCH_SUCCESS: {
      const { conversations = [] } = action.payload;
      return {
        ...state,
        ...conversations.reduce((acc, { id, unreadMessages = 0 }) => ({ ...acc, [id]: unreadMessages }), state)
      };
    }
    default:
      return state;
  }
};

const unreadMessagesReducer = combineReducers({ byConversation });

export default unreadMessagesReducer;
