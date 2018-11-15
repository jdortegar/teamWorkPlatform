import { combineReducers } from 'redux';
import _ from 'lodash';
import { TEAMMEMBERS_FETCH_SUCCESS, TEAMMEMBER_RECEIVE } from 'src/actions';

const byTeam = (state = {}, action) => {
  switch (action.type) {
    case TEAMMEMBERS_FETCH_SUCCESS: {
      const { teamId, teamMembers = [] } = action.payload;
      return {
        ...state,
        [teamId]: _.union(state[teamId], teamMembers.map(member => member.userId))
      };
    }
    case TEAMMEMBER_RECEIVE: {
      const { teamId, teamMembers = [] } = action.payload;
      return {
        ...state,
        [teamId]: _.union(state[teamId], [teamMembers.userId])
      };
    }
    default:
      return state;
  }
};

export default combineReducers({ byTeam });
