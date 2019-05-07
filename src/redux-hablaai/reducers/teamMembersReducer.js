import { combineReducers } from 'redux';
import _ from 'lodash';
import { TEAMMEMBERS_FETCH_SUCCESS, TEAMMEMBERS_PUBLIC_FETCH_SUCCESS, TEAMMEMBER_RECEIVE } from 'src/actions';

const byTeam = (state = {}, action) => {
  switch (action.type) {
    case TEAMMEMBERS_PUBLIC_FETCH_SUCCESS:
    case TEAMMEMBERS_FETCH_SUCCESS: {
      const { teamId, teamMembers = [] } = action.payload;
      return {
        ...state,
        [teamId]: _.union(state[teamId], teamMembers.map(member => member.userId))
      };
    }
    case TEAMMEMBER_RECEIVE: {
      const { teamId, teamMember = {} } = action.payload;
      return {
        ...state,
        [teamId]: _.union(state[teamId], [teamMember.userId])
      };
    }
    default:
      return state;
  }
};

export default combineReducers({ byTeam });
