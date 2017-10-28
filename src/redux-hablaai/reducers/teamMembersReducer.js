import _ from 'lodash';
import { TEAMMEMBERS_FETCH_SUCCESS } from '../actions';

const INITIAL_STATE = {
  teamMemberIdIdByUserId: {},
  userIdsByTeamId: {}
};

const teamMembersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TEAMMEMBERS_FETCH_SUCCESS: {
      const teamMemberIdIdByUserId = _.cloneDeep(state.teamMemberIdIdByUserId);
      const userIdsByTeamId = _.cloneDeep(state.userIdsByTeamId);

      const teamId = action.payload.teamId;
      action.payload.teamMembers.forEach((teamMember) => {
        teamMemberIdIdByUserId[teamMember.userId] = teamMember.teamMemberId;
        let teamMembers = userIdsByTeamId[teamId];
        if (!teamMembers) {
          teamMembers = {};
          userIdsByTeamId[teamId] = teamMembers;
        }
        teamMembers[teamMember.userId] = { teamMemberId: teamMember.teamMemberId };
      });

      return {
        ...state,
        teamMemberIdIdByUserId,
        userIdsByTeamId
      };
    }
    default:
      return state;
  }
};

export default teamMembersReducer;
