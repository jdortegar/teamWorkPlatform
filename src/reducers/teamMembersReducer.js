import {
  REQUESTING_TEAM_MEMBERS,
  RECEIVE_TEAM_MEMBERS,
  REQUEST_TEAM_MEMBERS_ERROR
} from '../actions/types';

const INITIAL_STATE = {
  teamMembersByTeamId: {},

  received: false,
  requesting: false,
  error: null,
  errorMeta: {}
};

const teamMembersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REQUESTING_TEAM_MEMBERS:
      return {
        ...state,
        received: false,
        requesting: true,
        error: null,
        errorMeta: {}
      };
    case RECEIVE_TEAM_MEMBERS: {
      const teamMembersByTeamId = _.cloneDeep(state.teamMembersByTeamId);
      const teamMembers = {};
      teamMembersByTeamId[action.payload.teamId] = teamMembers;

      action.payload.teamMembers.forEach((teamMember) => { teamMembers[teamMember.userId] = teamMember; });

      return {
        ...state,
        teamMembersByTeamId,
        received: true,
        requesting: false,
        error: null,
        errorMeta: {}
      };
    }
    case REQUEST_TEAM_MEMBERS_ERROR:
      return {
        ...state,
        received: false,
        requesting: false,
        error: action.payload,
        errorMeta: action.meta
      };
    default:
      return state;
  }
};

export default teamMembersReducer;
