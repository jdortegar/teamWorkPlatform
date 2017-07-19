import _ from 'lodash';
import {
  REQUEST_TEAM_ROOMS,
  RECEIVE_TEAM_ROOMS,
  REQUEST_TEAM_ROOMS_ERROR,
  SET_CURRENT_TEAM_ROOM,
  GET_ALL_TEAM_ROOMS
} from '../actions/types';

const INITIAL_STATE = {
  data: {},
  received: false,
  requesting: false,
  error: null,
  currentTeamRoom: {},
  teamRooms: []
};

const teamRoomsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REQUEST_TEAM_ROOMS:
      return {
        ...state,
        received: false,
        requesting: true,
        error: null
      };
    case RECEIVE_TEAM_ROOMS: {
      const { subscriberOrgId, teamId, teamRooms } = action.payload;
      const stateData = _.cloneDeep(state.data);
      stateData[subscriberOrgId] = stateData[subscriberOrgId] || {};
      stateData[subscriberOrgId][teamId] = teamRooms;

      const currentTeamRoom = _.cloneDeep(state.currentTeamRoom);
      currentTeamRoom[subscriberOrgId] = currentTeamRoom[subscriberOrgId] || {};
      currentTeamRoom[subscriberOrgId][teamId] = teamRooms;

      return {
        ...state,
        data: stateData,
        received: true,
        requesting: false,
        error: null,
        currentTeamRoom
      };
    }
    case REQUEST_TEAM_ROOMS_ERROR:
      return {
        ...state,
        received: false,
        requesting: false,
        error: action.payload
      };
    case GET_ALL_TEAM_ROOMS:
      return {
        ...state,
        teamRooms: action.payload
      }
    case SET_CURRENT_TEAM_ROOM: {
      const { subscriberOrgId, teamId, teamRoom } = action.payload;
      const currentTeamRoom = _.cloneDeep(state.currentTeamRoom);
      currentTeamRoom[subscriberOrgId] = currentTeamRoom[subscriberOrgId] || {};
      currentTeamRoom[subscriberOrgId][teamId] = teamRoom;
      return {
        ...state,
        currentTeamRoom
      };
    }
    default:
      return state;
  }
};

export default teamRoomsReducer;
