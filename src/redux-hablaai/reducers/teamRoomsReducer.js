import _ from 'lodash';
import {
  TEAMROOMS_FETCH_SUCCESS,
  TEAMROOM_RECEIVE
} from '../actions';

const INITIAL_STATE = {
  teamRoomById: {},
  teamRoomIdsByTeamId: {}
};

const addTeamRoom = (teamRoom, teamRoomById, teamRoomIdsByTeamId) => {
  teamRoomById[teamRoom.teamRoomId] = teamRoom; // eslint-disable-line no-param-reassign
  let teamRoomIds = teamRoomIdsByTeamId[teamRoom.teamId];
  if (!teamRoomIds) {
    teamRoomIds = [];
    teamRoomIdsByTeamId[teamRoom.teamId] = teamRoomIds; // eslint-disable-line no-param-reassign
  }
  teamRoomIds.push(teamRoom.teamRoomId);
};

const teamRoomsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TEAMROOMS_FETCH_SUCCESS: {
      const { teamId, teamRooms } = action.payload;
      let teamRoomById;
      let teamRoomIdsByTeamId;
      let teamRoomIds;

      if (teamId) {
        teamRoomById = _.cloneDeep(state.teamRoomById);
        teamRoomIdsByTeamId = _.cloneDeep(state.teamRoomIdsByTeamId);

        // Clear out team rooms of teamId.
        teamRoomIds = teamRoomIdsByTeamId[teamId];
        if (teamRoomIds) {
          teamRoomIds.forEach((teamRoomId) => {
            delete teamRoomById[teamRoomId];
          });
          delete teamRoomIdsByTeamId[teamId];
        }
      } else {
        teamRoomById = {};
        teamRoomIdsByTeamId = {};
      }

      teamRooms.forEach((teamRoom) => { addTeamRoom(teamRoom, teamRoomById, teamRoomIdsByTeamId); });

      return {
        ...state,
        teamRoomById,
        teamRoomIdsByTeamId
      };
    }
    case TEAMROOM_RECEIVE: {
      const { teamId, teamRoom } = action.payload;
      const teamRoomById = _.cloneDeep(state.teamRoomById);
      const existingTeamRoom = teamRoomById[teamRoom.teamRoomId];
      teamRoomById[teamRoom.teamRoomId] = teamRoom;
      let teamRoomIdsByTeamId = state.teamRoomIdsByTeamId;

      if (!existingTeamRoom) {
        teamRoomIdsByTeamId = _.cloneDeep(state.teamRoomIdsByTeamId);
        const teamRoomIds = teamRoomIdsByTeamId[teamId] || [];
        teamRoomIds.push(teamRoom.teamRoomId);
      }

      return {
        ...state,
        teamRoomById,
        teamRoomIdsByTeamId
      };
    }
    default:
      return state;
  }
};

export default teamRoomsReducer;
