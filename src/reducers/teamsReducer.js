import _ from 'lodash';
import {
  REQUESTING_TEAMS,
  RECEIVE_ALL_TEAMS,
  RECEIVE_TEAMS,
  REQUEST_TEAMS_ERROR,
  SET_CURRENT_TEAM_ID
} from '../actions/types';

const INITIAL_STATE = {
  raw: [], // TODO: may not be needed.
  teamById: {},
  teamIdsBySubscriberOrgId: {},
  currentTeamIdBySubscriberOrgId: {},

  received: false,
  requesting: false,
  error: null
};

function defaultTeam(teamIds, teamById) {
  // The primary team.
  let selectedTeam = null;
  for (const teamId of teamIds) {
    const team = teamById[teamId];
    if (team.primary === true) {
      selectedTeam = team;
      break;
    }
  }
  return selectedTeam;
}

const teamsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REQUESTING_TEAMS:
      return {
        ...state,
        received: false,
        requesting: true,
        error: null
      };
    case RECEIVE_ALL_TEAMS: {
      const teamById = {};
      const teamIdsBySubscriberOrgId = {};
      const currentTeamIdBySubscriberOrgId = {};
      action.payload.forEach((team) => {
        teamById[team.teamId] = team;
        let teamIds = teamIdsBySubscriberOrgId[team.subscriberOrgId];
        if (!teamIds) {
          teamIds = [];
          teamIdsBySubscriberOrgId[team.subscriberOrgId] = teamIds;
        }
        teamIds.push(team.teamId);
        if (team.teamId === state.currentTeamIdBySubscriberOrgId[team.subscriberOrgId]) {
          currentTeamIdBySubscriberOrgId[team.subscriberOrgId] = team.teamId;
        }
      });

      Object.keys(teamIdsBySubscriberOrgId).forEach((subscriberOrgId) => {
        const currentTeamId = currentTeamIdBySubscriberOrgId[subscriberOrgId];
        if ((!currentTeamId) || (currentTeamId === null)) {
          currentTeamIdBySubscriberOrgId[subscriberOrgId] = defaultTeam(teamIdsBySubscriberOrgId[subscriberOrgId], teamById).teamId;
        }
      });

      return {
        ...state,
        raw: action.payload,
        teamById,
        teamIdsBySubscriberOrgId,
        currentTeamIdBySubscriberOrgId,
        received: true,
        requesting: false,
        error: null
      };
    }
    case RECEIVE_TEAMS: {
      const { subscriberOrgId, teams } = action.payload;
      const teamById = _.cloneDeep(state.teamById);
      const teamIdsBySubscriberOrgId = _.clone(state.teamIdsBySubscriberOrgId);
      const teamIds = [];
      teamIdsBySubscriberOrgId[subscriberOrgId] = teamIds;
      const currentTeamIdBySubscriberOrgId = _.clone(state.currentTeamIdBySubscriberOrgId);

      const existingCurrentTeamId = state.currentTeamIdBySubscriberOrgId[subscriberOrgId];
      let primaryTeamId;
      let chosenCurrentTeamId;
      teams.forEach((team) => {
        teamById[team.teamId] = team;
        teamIds.push(team.teamId);
        primaryTeamId = primaryTeamId || (team.primary) ? team : undefined;
        chosenCurrentTeamId = chosenCurrentTeamId || (existingCurrentTeamId === team.teamId) ? existingCurrentTeamId : undefined;
      });

      chosenCurrentTeamId = chosenCurrentTeamId || primaryTeamId;
      currentTeamIdBySubscriberOrgId[subscriberOrgId] = chosenCurrentTeamId;

      return {
        ...state,
        // TODO: raw, some how merge received with existing raw.
        teamById,
        teamIdsBySubscriberOrgId,
        currentTeamIdBySubscriberOrgId,
        received: true,
        requesting: false,
        error: null
      };
    }
    case REQUEST_TEAMS_ERROR:
      return {
        ...state,
        received: false,
        requesting: false,
        error: action.payload
      };
    case SET_CURRENT_TEAM_ID: {
      const { subscriberOrgId, teamId } = action.payload;
      const currentTeamIdBySubscriberOrgId = _.cloneDeep(state.currentTeamIdBySubscriberOrgId);
      currentTeamIdBySubscriberOrgId[subscriberOrgId] = teamId;
      return {
        ...state,
        currentTeamIdBySubscriberOrgId
      };
    }
    default:
      return state;
  }
};

export default teamsReducer;
