import _ from 'lodash';
import {
  REQUEST_TEAMS,
  RECEIVE_TEAMS,
  REQUEST_TEAMS_ERROR,
  SET_CURRENT_TEAM
} from '../actions/types';

const INITIAL_STATE = {
  data: {},
  received: false,
  requesting: false,
  error: null,
  currentTeam: {}
};

const teamsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REQUEST_TEAMS:
      return {
        ...state,
        received: false,
        requesting: true,
        error: null
      };
    case RECEIVE_TEAMS: {
      const { subscriberOrgId, teams } = action.payload;
      const stateData = _.cloneDeep(state.data);
      stateData[subscriberOrgId] = teams;
      let currentOrgTeam = state.currentTeam[subscriberOrgId];
      const notInList = (!currentOrgTeam) || teams.every(team => (currentOrgTeam.teamId !== team.teamId));
      currentOrgTeam = (notInList) ? teams[0] : currentOrgTeam; // Default to first team.
      const { currentTeam } = state;
      currentTeam[subscriberOrgId] = currentOrgTeam;
      return {
        ...state,
        data: stateData,
        received: true,
        requesting: false,
        error: null,
        currentTeam
      };
    }
    case REQUEST_TEAMS_ERROR:
      return {
        ...state,
        received: false,
        requesting: false,
        error: action.payload
      };
    case SET_CURRENT_TEAM: {
      const { subscriberOrgId, team } = action.payload;
      const currentTeam = _.cloneDeep(state.currentTeam);
      currentTeam[subscriberOrgId] = team;
      return {
        ...state,
        currentTeam
      };
    }
    default:
      return state;
  }
};

export default teamsReducer;
