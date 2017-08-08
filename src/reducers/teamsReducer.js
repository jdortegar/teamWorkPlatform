import _ from 'lodash';
import {
  REQUESTING_TEAMS,
  RECEIVE_ALL_TEAMS,
  RECEIVE_TEAMS,
  RECEIVE_TEAM,
  REQUEST_TEAMS_ERROR,
  SET_CURRENT_TEAM_ID
} from '../actions/types';

const INITIAL_STATE = {
  raw: [], // TODO: may not be needed.
  teamById: {},
  teamIdsBySubscriberOrgId: {},
  currentTeamIdBySubscriberOrgId: {},

  working: false,
  error: null,
  errorMeta: {}
};

function defaultTeam(teamIds, teamById) {
  // The primary team, or first active, or first.
  let primaryTeam;
  let activeTeam;
  for (const teamId of teamIds) {
    const team = teamById[teamId];
    if (team.primary === true) {
      primaryTeam = team;
      break;
    }
    if ((!activeTeam) && (team.active === true)) {
      activeTeam = team;
    }
  }
  return primaryTeam || activeTeam || teamById[teamIds[0]];
}

const teamsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REQUESTING_TEAMS:
      return {
        ...state,
        working: true,
        error: null,
        errorMeta: {}
      };
    case RECEIVE_ALL_TEAMS: {
      const teamById = {};
      const teamIdsBySubscriberOrgId = {};
      const currentTeamIdBySubscriberOrgId = {};
      action.payload.teams.forEach((team) => {
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
          const selectedTeam = defaultTeam(teamIdsBySubscriberOrgId[subscriberOrgId], teamById);
          currentTeamIdBySubscriberOrgId[subscriberOrgId] = (selectedTeam) ? selectedTeam.teamId : null;
        }
      });

      return {
        ...state,
        raw: action.payload.teams,
        teamById,
        teamIdsBySubscriberOrgId,
        currentTeamIdBySubscriberOrgId,
        working: false,
        error: null,
        errorMeta: {}
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
        working: false,
        error: null,
        errorMeta: {}
      };
    }
    case RECEIVE_TEAM: {
      const { subscriberOrgId, team } = action.payload;
      const teamById = _.cloneDeep(state.teamById);
      const existingTeam = teamById[team.teamId];
      teamById[team.teamId] = team;
      let teamIdsBySubscriberOrgId = state.teamIdsBySubscriberOrgId;

      if (!existingTeam) {
        teamIdsBySubscriberOrgId = _.cloneDeep(state.teamIdsBySubscriberOrgId);
        const teamIds = teamIdsBySubscriberOrgId[subscriberOrgId] || [];
        teamIds.push(team.teamId);
      }

      return {
        ...state,
        teamById,
        teamIdsBySubscriberOrgId
      };
    }
    case REQUEST_TEAMS_ERROR:
      return {
        ...state,
        working: false,
        error: action.payload,
        errorMeta: action.meta || {}
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
