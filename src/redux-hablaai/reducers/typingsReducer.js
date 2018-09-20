import _ from 'lodash';
import { TYPING_RECEIVE } from 'src/actions';

const INITIAL_STATE = {
  typingByConversationIdsByUserId: {},
  typingByUserIdsByConversationId: {}
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

      const typingByUserIdsByConversationId = _.cloneDeep(state.typingByUserIdsByConversationId);
      let userIds = typingByUserIdsByConversationId[conversationId];
      if (!userIds) {
        userIds = {};
        typingByUserIdsByConversationId[conversationId] = userIds;
      }
      userIds[userId] = isTyping;

      return {
        ...state,
        typingByConversationIdsByUserId,
        typingByUserIdsByConversationId
      };
    }
    default:
      return state;
  }
};

export default typingsReducer;
