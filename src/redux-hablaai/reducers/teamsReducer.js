import { combineReducers } from 'redux';
import _ from 'lodash';
import { TEAMS_FETCH_SUCCESS, TEAM_RECEIVE, UPDATED_TEAM_SUCCESS, CREATE_TEAM_STATUS_SUCCESS } from 'src/actions';

const byId = (state = {}, action) => {
  switch (action.type) {
    case TEAMS_FETCH_SUCCESS: {
      const { teams = [] } = action.payload;
      return {
        ...state,
        ...teams.reduce((acc, team) => {
          acc[team.teamId] = team;
          return acc;
        }, {})
      };
    }
    case TEAM_RECEIVE: {
      const { team = {} } = action.payload;
      return {
        ...state,
        [team.teamId]: team
      };
    }
    case UPDATED_TEAM_SUCCESS: {
      const { teamUpdated } = action.payload;
      const stateData = _.cloneDeep(state);

      stateData[teamUpdated.teamId] = {
        ...stateData[teamUpdated.teamId],
        ...teamUpdated
      };

      return stateData;
    }
    case CREATE_TEAM_STATUS_SUCCESS: {
      const { teamcreated } = action.payload;
      const stateData = _.cloneDeep(state);

      stateData[teamcreated.teamId] = {
        ...teamcreated
      };

      return stateData;
    }
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case TEAMS_FETCH_SUCCESS: {
      const { teams = [] } = action.payload;
      return _.union(state, teams.map(team => team.teamId));
    }
    case TEAM_RECEIVE: {
      const { team = {} } = action.payload;
      return _.union(state, [team.teamId]);
    }
    default:
      return state;
  }
};

const idsByOrg = (state = {}, action) => {
  switch (action.type) {
    case TEAMS_FETCH_SUCCESS: {
      const { teams = [] } = action.payload;
      return {
        ...state,
        ...teams.reduce((acc, team) => {
          acc[team.subscriberOrgId] = _.union(acc[team.subscriberOrgId], [team.teamId]);
          return acc;
        }, {})
      };
    }
    case TEAM_RECEIVE: {
      const { team = {} } = action.payload;
      return {
        ...state,
        [team.subscriberOrgId]: _.union(state[team.subscriberOrgId], [team.teamId])
      };
    }
    default:
      return state;
  }
};

const teamsReducer = combineReducers({
  byId,
  allIds,
  idsByOrg
});

export default teamsReducer;
