import _ from 'lodash';
import {
  PRESENCE_CHANGE,
  TEAMROOMMEMBER_RECEIVE,
  SUBSCRIBERS_FETCH_SUCCESS,
  TEAMMEMBERS_FETCH_SUCCESS,
  TEAMROOMMEMBERS_FETCH_SUCCESS
} from '../actions';

const INITIAL_STATE = {
  presencesByUserId: {}
};

// Uniqueness by address + userAgent combination.
const buildPresenceUniqueId = ({ address, userAgent }) => `${address}##${userAgent}`;

const updatePresences = (users, presencesByUserId) => {
  const result = _.cloneDeep(presencesByUserId);
  users.forEach(({ presence = [], userId }) => (
    presence.forEach((item) => {
      result[userId] = {
        ...result[userId],
        [buildPresenceUniqueId(item)]: item
      };
    })
  ));
  return result;
};

const presencesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PRESENCE_CHANGE: {
      const presencesByUserId = _.cloneDeep(state.presencesByUserId);
      const { presence } = action.payload;

      presencesByUserId[presence.userId] = {
        ...presencesByUserId[presence.userId],
        [buildPresenceUniqueId(presence)]: presence
      };

      return {
        ...state,
        presencesByUserId
      };
    }
    case SUBSCRIBERS_FETCH_SUCCESS: {
      return {
        ...state,
        presencesByUserId: updatePresences(action.payload.subscribers, state.presencesByUserId)
      };
    }
    case TEAMMEMBERS_FETCH_SUCCESS: {
      return {
        ...state,
        presencesByUserId: updatePresences(action.payload.teamMembers, state.presencesByUserId)
      };
    }
    case TEAMROOMMEMBERS_FETCH_SUCCESS: {
      return {
        ...state,
        presencesByUserId: updatePresences(action.payload.teamRoomMembers, state.presencesByUserId)
      };
    }
    case TEAMROOMMEMBER_RECEIVE: {
      return {
        ...state,
        presencesByUserId: updatePresences([action.payload.teamRoomMember], state.presencesByUserId)
      };
    }
    default:
      return state;
  }
};

export default presencesReducer;
