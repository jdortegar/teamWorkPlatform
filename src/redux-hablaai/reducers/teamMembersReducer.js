import _ from 'lodash';
import { TEAMMEMBERS_FETCH_SUCCESS } from '../actions';

const INITIAL_STATE = {
  teamMemberByUserId: {},
  teamMemberIdIdByUserId: {},
  userIdsByTeamId: {}
};

const teamMembersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TEAMMEMBERS_FETCH_SUCCESS: {
      const teamMemberByUserId = _.cloneDeep(state.teamMemberByUserId);
      const teamMemberIdIdByUserId = _.cloneDeep(state.teamMemberIdIdByUserId);
      const userIdsByTeamId = _.cloneDeep(state.userIdsByTeamId);

      const teamId = action.payload.teamId;
      action.payload.teamMembers.forEach((teamMember) => {
        teamMemberByUserId[teamMember.userId] = teamMember;
        teamMemberIdIdByUserId[teamMember.userId] = teamMember.teamMemberId;
        let teamMembers = userIdsByTeamId[teamId];
        if (!teamMembers) {
          teamMembers = [];
          userIdsByTeamId[teamId] = teamMembers;
        }
        teamMembers.push(teamMember.userId);
      });

      return {
        ...state,
        teamMemberByUserId,
        teamMemberIdIdByUserId,
        userIdsByTeamId
      };
    }
    default:
      return state;
  }
};

export default teamMembersReducer;
