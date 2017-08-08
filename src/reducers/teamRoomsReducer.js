import _ from 'lodash';
import {
  REQUESTING_TEAM_ROOMS,
  RECEIVE_ALL_TEAM_ROOMS,
  RECEIVE_TEAM_ROOMS,
  RECEIVE_TEAM_ROOM,
  REQUEST_TEAM_ROOMS_ERROR,
  SET_CURRENT_TEAM_ROOM_ID
} from '../actions/types';

const INITIAL_STATE = {
  raw: [], // TODO: may not be needed
  teamRoomById: {},
  teamRoomIdsByTeamId: {},
  currentTeamRoomIdByTeamId: {},

  working: false,
  error: null,
  errorMeta: {}
};

function defaultTeamRoom(teamRoomIds, teamRoomById) {
  // The primary team room, or first active, or first.
  let primaryTeamRoom;
  let activeTeamRoom;
  for (const teamRoomId of teamRoomIds) {
    const teamRoom = teamRoomById[teamRoomId];
    if (teamRoom.primary === true) {
      primaryTeamRoom = teamRoom;
      break;
    }
    if ((!activeTeamRoom) && (teamRoom.active)) {
      activeTeamRoom = teamRoom;
    }
  }
  return primaryTeamRoom || activeTeamRoom || teamRoomById[teamRoomIds[0]];
}

const teamRoomsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REQUESTING_TEAM_ROOMS:
      return {
        ...state,
        working: true,
        error: null,
        errorMeta: {}
      };
    case RECEIVE_ALL_TEAM_ROOMS: {
      const teamRoomById = {};
      const teamRoomIdsByTeamId = {};
      const currentTeamRoomIdByTeamId = {};
      action.payload.teamRooms.forEach((teamRoom) => {
        teamRoomById[teamRoom.teamRoomId] = teamRoom;
        let teamRoomIds = teamRoomIdsByTeamId[teamRoom.teamId];
        if (!teamRoomIds) {
          teamRoomIds = [];
          teamRoomIdsByTeamId[teamRoom.teamId] = teamRoomIds;
        }
        teamRoomIds.push(teamRoom.teamRoomId);
        if (teamRoom.teamRoomId === state.currentTeamRoomIdByTeamId[teamRoom.teamId]) {
          currentTeamRoomIdByTeamId[teamRoom.teamId] = teamRoom.teamRoomId;
        }
      });

      Object.keys(teamRoomIdsByTeamId).forEach((teamId) => {
        const currentTeamRoomId = currentTeamRoomIdByTeamId[teamId];
        if ((!currentTeamRoomId) || (currentTeamRoomId === null)) {
          currentTeamRoomIdByTeamId[teamId] = defaultTeamRoom(teamRoomIdsByTeamId[teamId], teamRoomById).teamRoomId;
        }
      });
      return {
        ...state,
        raw: action.payload.teamRooms,
        teamRoomById,
        teamRoomIdsByTeamId,
        currentTeamRoomIdByTeamId,
        working: false,
        error: null,
        errorMeta: {}
      };
    }
    case RECEIVE_TEAM_ROOMS: {
      const { teamId, teamRooms } = action.payload;
      const teamRoomById = _.cloneDeep(state.teamRoomById);
      const teamRoomIdsByTeamId = _.clone(state.teamRoomIdsByTeamId);
      const teamRoomIds = [];
      teamRoomIdsByTeamId[teamId] = teamRoomIds;
      const currentTeamRoomIdByTeamId = _.clone(state.currentTeamRoomIdByTeamId);

      const existingCurrentTeamRoomId = state.currentTeamRoomIdByTeamId[teamId];
      let primaryTeamRoomId;
      let chosenCurrentTeamRoomId;
      teamRooms.forEach((teamRoom) => {
        teamRoomById[teamRoom.teamRoomId] = teamRoom;
        teamRoomIds.push(teamRoom.teamRoomId);
        primaryTeamRoomId = primaryTeamRoomId || (teamRoom.primary) ? teamRoom : undefined;
        chosenCurrentTeamRoomId = chosenCurrentTeamRoomId || (existingCurrentTeamRoomId === teamRoom.teamRoomId) ? existingCurrentTeamRoomId : undefined;
      });

      chosenCurrentTeamRoomId = chosenCurrentTeamRoomId || primaryTeamRoomId;
      currentTeamRoomIdByTeamId[teamId] = chosenCurrentTeamRoomId;

      return {
        ...state,
        // TODO: raw, some how merge received with existing raw.
        teamRoomById,
        teamRoomIdsByTeamId,
        currentTeamRoomIdByTeamId,
        working: false,
        error: null,
        errorMeta: {}
      };
    }
    case RECEIVE_TEAM_ROOM: {
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
    case REQUEST_TEAM_ROOMS_ERROR:
      return {
        ...state,
        working: false,
        error: action.payload,
        errorMeta: action.meta || {}
      };
    case SET_CURRENT_TEAM_ROOM_ID: {
      const { teamId, teamRoomId } = action.payload;
      const currentTeamRoomIdByTeamId = _.cloneDeep(state.currentTeamRoomIdByTeamId);
      currentTeamRoomIdByTeamId[teamId] = teamRoomId;
      return {
        ...state,
        currentTeamRoomIdByTeamId
      };
    }
    default:
      return state;
  }
};

export default teamRoomsReducer;
