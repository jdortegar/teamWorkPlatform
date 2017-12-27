import {
  MESSAGES_READ_FETCH_SUCCESS,
  MESSAGES_READ_RECEIVE
} from '../actions';

const INITIAL_STATE = {
  readMessagesByConversationId: {}
};

const readMessagesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MESSAGES_READ_FETCH_SUCCESS:
    case MESSAGES_READ_RECEIVE: {
      const { conversationIds } = action.payload.readMessages;
      return { ...state, ...conversationIds };
    }
    default:
      return state;
  }
};

export default readMessagesReducer;
