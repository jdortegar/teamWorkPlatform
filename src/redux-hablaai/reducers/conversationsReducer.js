import { combineReducers } from 'redux';
import { union } from 'lodash';
import {
  CONVERSATIONS_FETCH_REQUEST,
  CONVERSATIONS_FETCH_SUCCESS,
  CONVERSATIONS_FETCH_FAILURE,
  CONVERSATIONS_CREATE_SUCCESS,
  CONVERSATIONS_RECEIVE,
  CREATE_TEAM_SUCCESS
} from 'src/actions';

const loaded = (state = false, action) => {
  switch (action.type) {
    case CONVERSATIONS_FETCH_REQUEST:
      return false;
    case CONVERSATIONS_FETCH_SUCCESS:
    case CONVERSATIONS_FETCH_FAILURE:
      return true;
    default:
      return state;
  }
};

const byId = (state = {}, action) => {
  switch (action.type) {
    case CONVERSATIONS_RECEIVE:
    case CONVERSATIONS_FETCH_SUCCESS: {
      const { conversations = [] } = action.payload;
      return {
        ...state,
        ...conversations.reduce((acc, conversation) => ({ ...acc, [conversation.id]: conversation }), state)
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
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case CONVERSATIONS_RECEIVE:
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
    default:
      return state;
  }
};

const idsByTeam = (state = {}, action) => {
  switch (action.type) {
    case CONVERSATIONS_RECEIVE:
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
    default:
      return state;
  }
};

const idsByMember = (state = {}, action) => {
  switch (action.type) {
    case CONVERSATIONS_RECEIVE:
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

const conversationsReducer = combineReducers({
  loaded,
  byId,
  allIds,
  idsByTeam,
  idsByMember
});

export default conversationsReducer;
