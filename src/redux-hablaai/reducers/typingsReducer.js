import _ from 'lodash';
import {
  TYPING_RECEIVE
} from '../actions';

const INITIAL_STATE = {
  typingByConversationIdsByUserId: {}
};

const typingsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TYPING_RECEIVE: {
      const { userId, conversationId, isTyping } = action.payload;
      const typingByConversationIdsByUserId = _.cloneDeep(state.typingByConversationIdsByUserId);
      let conversationIds = typingByConversationIdsByUserId[userId];

      if (!conversationIds) {
        conversationIds = {};
        typingByConversationIdsByUserId[userId] = conversationIds;
      }

      conversationIds[conversationId] = isTyping;
      return {
        ...state,
        typingByConversationIdsByUserId
      };
    }
    default:
      return state;
  }
};

export default typingsReducer;
