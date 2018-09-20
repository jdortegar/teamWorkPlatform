import _ from 'lodash';
import { TEAMS_FETCH_SUCCESS, TEAM_RECEIVE } from 'src/actions';

const INITIAL_STATE = {
  teamById: {},
  teamIdsBySubscriberOrgId: {}
};

const addTeam = (team, teamById, teamIdsBySubscriberOrgId) => {
  teamById[team.teamId] = team; // eslint-disable-line no-param-reassign
  let teamIds = teamIdsBySubscriberOrgId[team.subscriberOrgId];
  if (!teamIds) {
    teamIds = [];
    teamIdsBySubscriberOrgId[team.subscriberOrgId] = teamIds; // eslint-disable-line no-param-reassign
  }

  if (teamIds.indexOf(team.teamId) < 0) {
    teamIds.push(team.teamId);
  }
};

const teamsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TEAMS_FETCH_SUCCESS: {
      const teamById = _.cloneDeep(state.teamById);
      const teamIdsBySubscriberOrgId = _.cloneDeep(state.teamIdsBySubscriberOrgId);
      const { subscriberOrgId, teams } = action.payload;
      let teamIds;

      if (subscriberOrgId) {
        // Clear out teams of subscriberOrgId.
        teamIds = teamIdsBySubscriberOrgId[subscriberOrgId];
        if (teamIds) {
          teamIds.forEach(teamId => {
            delete teamById[teamId];
          });
        }
        delete teamIdsBySubscriberOrgId[subscriberOrgId];
      }

      teams.forEach(team => {
        addTeam(team, teamById, teamIdsBySubscriberOrgId);
      });

      return {
        ...state,
        teamById,
        teamIdsBySubscriberOrgId
      };
    }
    case TEAM_RECEIVE: {
      const { team } = action.payload;
      const teamById = _.cloneDeep(state.teamById);
      const teamIdsBySubscriberOrgId = _.cloneDeep(state.teamIdsBySubscriberOrgId);
      addTeam(team, teamById, teamIdsBySubscriberOrgId);

      return {
        ...state,
        teamById,
        teamIdsBySubscriberOrgId
      };
    }
    default:
      return state;
  }
};

export default teamsReducer;
