import { combineReducers } from 'redux';
import { union, omit } from 'lodash';
import {
  CONVERSATIONS_FETCH_SUCCESS,
  CONVERSATIONS_CREATE_SUCCESS,
  CONVERSATIONS_RECEIVE,
  CREATE_TEAM_SUCCESS,
  MESSAGES_FETCH_SUCCESS,
  MESSAGE_RECEIVE,
  MESSAGE_CREATE_REQUEST,
  MESSAGE_CREATE_SUCCESS,
  MESSAGE_CREATE_FAILURE,
  MESSAGE_DELETE_SUCCESS
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
    case CONVERSATIONS_CREATE_SUCCESS: {
      const { conversation } = action.payload;
      return { ...state, [conversation.id]: conversation };
    }
    // TODO: remove this after listening to websocket event
    case CREATE_TEAM_SUCCESS: {
      const { team } = action.payload;
      return { ...state, [team.conversationId]: { id: team.conversationId, members: [] } };
    }
    case CONVERSATIONS_RECEIVE: {
      // console.warn('CONVERSATIONS_RECEIVE', { payload: action.payload });
      return state;
    }
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
    case CONVERSATIONS_CREATE_SUCCESS: {
      const { conversation = {} } = action.payload;
      if (!conversation.id) return state;
      return union(state, [conversation.id]);
    }
    // TODO: remove this after listening to websocket event
    case CREATE_TEAM_SUCCESS: {
      const { team } = action.payload;
      return union(state, [team.conversationId]);
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
    // TODO: remove this after listening to websocket event
    case CREATE_TEAM_SUCCESS: {
      const { team } = action.payload;
      return { ...state, [team.conversationId]: team.teamId };
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
    case CONVERSATIONS_CREATE_SUCCESS: {
      const { conversation, currentUserId } = action.payload;
      if (!conversation) return state;
      const memberId = conversation.members.find(item => item !== currentUserId);
      return { ...state, [memberId]: conversation.id };
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
    case MESSAGE_DELETE_SUCCESS: {
      const { message } = action.payload;
      const deletedMessage = { ...message, deleted: true };
      return { ...state, [message.conversationId]: buildMessagesList([deletedMessage], state[message.conversationId]) };
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
