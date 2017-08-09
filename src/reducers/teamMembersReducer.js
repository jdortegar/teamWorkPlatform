import _ from 'lodash';
import {
  REQUESTING_TEAM_MEMBERS,
  RECEIVE_TEAM_MEMBERS,
  REQUEST_TEAM_MEMBERS_ERROR
} from '../actions/types';

const INITIAL_STATE = {
  teamMembersByTeamId: {}, // TODO: deprecated.  Remove when using selector instead.
  teamMemberUserIdsByTeamId: {},

  working: false,
  error: null,
  errorMeta: {}
};

const teamMembersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REQUESTING_TEAM_MEMBERS:
      return {
        ...state,
        working: true,
        error: null,
        errorMeta: {}
      };
    case RECEIVE_TEAM_MEMBERS: {
      const teamMembersByTeamId = _.cloneDeep(state.teamMembersByTeamId);
      teamMembersByTeamId[action.payload.teamId] = action.payload.teamMembers;

      const teamMemberUserIdsByTeamId = _.cloneDeep(state.teamMemberUserIdsByTeamId);
      teamMemberUserIdsByTeamId[action.payload.teamId] = action.payload.teamMembers.map(teamMember => teamMember.userId);

      return {
        ...state,
        teamMembersByTeamId,
        teamMemberUserIdsByTeamId,
        working: false,
        error: null,
        errorMeta: {}
      };
    }
    case REQUEST_TEAM_MEMBERS_ERROR:
      return {
        ...state,
        working: false,
        error: action.payload,
        errorMeta: action.meta || {}
      };
    default:
      return state;
  }
};

export default teamMembersReducer;
