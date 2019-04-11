import { combineReducers } from 'redux';
import { union, omit } from 'lodash';
import {
  CONVERSATIONS_FETCH_SUCCESS,
  // CONVERSATIONS_RECEIVE,
  MESSAGES_FETCH_SUCCESS,
  MESSAGE_RECEIVE,
  MESSAGE_CREATE_REQUEST,
  MESSAGE_CREATE_SUCCESS,
  MESSAGE_CREATE_FAILURE
  // CONVERSATION_DIRECT_RECEIVE
} from 'src/actions';
import buildMessagesList from 'src/lib/buildMessagesList';

const loaded = (state = false, action) => {
  switch (action.type) {
    case CONVERSATIONS_FETCH_SUCCESS:
      return true;
    default:
      return state;
  }
};

const byId = (state = {}, action) => {
  switch (action.type) {
    case CONVERSATIONS_FETCH_SUCCESS: {
      const { conversations = [] } = action.payload;
      return {
        ...state,
        ...conversations.reduce((acc, conversation) => ({ ...acc, [conversation.id]: conversation }), {})
      };
    }
    // case CONVERSATIONS_RECEIVE: {
    //   const { conversations = [] } = action.payload;
    //   return {
    //     ...state,
    //     ...conversations.reduce((acc, conversation) => {
    //       const participants = conversation.participants.map(({ userId }) => userId);
    //       acc[conversation.conversationId] = { ...conversation, participants };
    //       return acc;
    //     }, {})
    //   };
    // }
    // case CONVERSATION_DIRECT_RECEIVE: {
    //   const { conversation } = action.payload;
    //   if (!conversation) return state;
    //   return {
    //     ...state,
    //     [conversation.conversationId]: conversation
    //   };
    // }
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case CONVERSATIONS_FETCH_SUCCESS: {
      const { conversations = [] } = action.payload;
      return union(state, conversations.map(({ id }) => id));
    }
    // case CONVERSATIONS_RECEIVE: {
    //   const { conversations = [] } = action.payload;
    //   return union(state, conversations.map(({ conversationId }) => conversationId));
    // }
    // case CONVERSATION_DIRECT_RECEIVE: {
    //   const { conversation } = action.payload;
    //   if (!conversation) return state;
    //   return union(state, [conversation.conversationId]);
    // }
    default:
      return state;
  }
};

const idsByTeam = (state = {}, action) => {
  switch (action.type) {
    case CONVERSATIONS_FETCH_SUCCESS: {
      const { conversations = [] } = action.payload;
      return {
        ...state,
        ...conversations.reduce((acc, conversation) => {
          const { teamId } = conversation.appData || {};
          if (teamId) acc[teamId] = conversation.id;
          return acc;
        }, {})
      };
    }
    // case CONVERSATIONS_RECEIVE: {
    //   const { conversations = [] } = action.payload;
    //   return {
    //     ...state,
    //     ...conversations.reduce((acc, conversation) => {
    //       if (!conversation.teamId) return acc;
    //       acc[conversation.teamId] = union(acc[conversation.teamId], [conversation.conversationId]);
    //       return acc;
    //     }, {})
    //   };
    // }
    default:
      return state;
  }
};

const idsByMember = (state = {}, action) => {
  switch (action.type) {
    case CONVERSATIONS_FETCH_SUCCESS: {
      const { conversations = [], currentUserId } = action.payload;
      return {
        ...state,
        ...conversations.reduce((acc, { appData = {}, members = [], id }) => {
          const { teamId } = appData || {};
          if (!teamId) {
            const memberId = members.find(item => item !== currentUserId);
            if (memberId) acc[memberId] = id;
          }
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
    // case CONVERSATION_DIRECT_RECEIVE: {
    //   const { conversation = {} } = action.payload;
    //   return conversation && conversation.conversationId;
    // }
    default:
      return state;
  }
};

const messagesByConversation = (state = {}, action) => {
  switch (action.type) {
    case MESSAGES_FETCH_SUCCESS: {
      const { conversationId, messages = [] } = action.payload;
      return { ...state, [conversationId]: buildMessagesList(messages, state[conversationId]) };
    }
    case MESSAGE_RECEIVE: {
      const { conversationId, message, currentUserId } = action.payload;
      // ignore messages of the current user, they are handled via API response
      if (message.createdBy === currentUserId) return state;
      return { ...state, [conversationId]: buildMessagesList([message], state[conversationId]) };
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
  loaded,
  byId,
  allIds,
  idsByTeam,
  idsByMember,
  messagesByConversation,
  currentPersonalConversationId
});

export default conversationsReducer;
