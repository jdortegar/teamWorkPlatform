import _ from 'lodash';
import { TEAMMEMBERS_FETCH_SUCCESS, TEAMMEMBER_RECEIVE } from '../actions';

const INITIAL_STATE = {
  teamMemberIdByUserId: {},
  userIdsByTeamId: {}
};

const teamMembersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TEAMMEMBERS_FETCH_SUCCESS: {
      const teamMemberIdByUserId = _.cloneDeep(state.teamMemberIdByUserId);
      const userIdsByTeamId = _.cloneDeep(state.userIdsByTeamId);

      const teamId = action.payload.teamId;
      action.payload.teamMembers.forEach((teamMember) => {
        teamMemberIdByUserId[teamMember.userId] = teamMember.teamMemberId;
        let teamMembers = userIdsByTeamId[teamId];
        if (!teamMembers) {
          teamMembers = {};
          userIdsByTeamId[teamId] = teamMembers;
        }
        teamMembers[teamMember.userId] = { teamMemberId: teamMember.teamMemberId };
      });

      return {
        ...state,
        teamMemberIdByUserId,
        userIdsByTeamId
      };
    }
    case TEAMMEMBER_RECEIVE: {
      const teamMemberIdByUserId = _.cloneDeep(state.teamMemberIdByUserId);
      const userIdsByTeamId = _.cloneDeep(state.userIdsByTeamId);
      const { teamMember, teamId } = action.payload;

      teamMemberIdByUserId[teamMember.userId] = teamMember.teamMemberId;
      let teamMembers = userIdsByTeamId[teamId];
      if (!teamMembers) {
        teamMembers = {};
        userIdsByTeamId[teamId] = teamMembers;
      }
      teamMembers[teamMember.userId] = { teamMemberId: teamMember.teamMemberId };

      return {
        ...state,
        teamMemberIdByUserId,
        userIdsByTeamId
      };
    }
    default:
      return state;
  }
};

export default teamMembersReducer;
