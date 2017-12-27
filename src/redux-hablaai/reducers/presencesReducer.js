import _ from 'lodash';
import {
  PRESENCE_CHANGE,
  TEAMROOMMEMBER_RECEIVE,
  TEAMROOMMEMBERS_FETCH_SUCCESS
} from '../actions';

const INITIAL_STATE = {
  presencesByUserId: {}
};

// Uniqueness by address + userAgent combination.
const buildPresenceUniqueId = ({ address, userAgent }) => `${address}##${userAgent}`;

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
    case TEAMROOMMEMBERS_FETCH_SUCCESS: {
      const presencesByUserId = _.cloneDeep(state.presencesByUserId);
      const { teamRoomMembers } = action.payload;

      teamRoomMembers.forEach(({ presence, userId }) => (
        presence.forEach((item) => {
          presencesByUserId[userId] = {
            ...presencesByUserId[userId],
            [buildPresenceUniqueId(item)]: item
          };
        })
      ));

      return {
        ...state,
        presencesByUserId
      };
    }
    case TEAMROOMMEMBER_RECEIVE: {
      const presencesByUserId = _.cloneDeep(state.presencesByUserId);
      const { presence = [], userId } = action.payload.teamRoomMember;

      presence.forEach((item) => {
        presencesByUserId[userId] = {
          ...presencesByUserId[userId],
          [buildPresenceUniqueId(item)]: item
        };
      });

      return {
        ...state,
        presencesByUserId
      };
    }
    default:
      return state;
  }
};

export default presencesReducer;
