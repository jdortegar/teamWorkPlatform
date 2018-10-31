import _ from 'lodash';
import { TEAMMEMBERS_FETCH_SUCCESS, TEAMMEMBER_RECEIVE } from 'src/actions';

const INITIAL_STATE = {
  teamMemberIdByTeamIdByUserId: {},
  userIdsByTeamId: {}
};

const teamMembersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TEAMMEMBERS_FETCH_SUCCESS: {
      const teamMemberIdByTeamIdByUserId = _.cloneDeep(state.teamMemberIdByTeamIdByUserId);
      const userIdsByTeamId = _.cloneDeep(state.userIdsByTeamId);

      const { teamId } = action.payload;
      action.payload.teamMembers.forEach(teamMember => {
        if (!teamMember || !teamMember.userId) return;
        let teams = teamMemberIdByTeamIdByUserId[teamMember.userId];
        if (!teams) {
          teams = {};
          teamMemberIdByTeamIdByUserId[teamMember.userId] = teams;
        }
        teamMemberIdByTeamIdByUserId[teamMember.userId] = teamMember.teamMemberId;
        let teamMembers = userIdsByTeamId[teamId];
        if (!teamMembers) {
          teamMembers = {};
          userIdsByTeamId[teamId] = teamMembers;
        }
        teamMembers[teamMember.userId] = { teamMemberId: teamMember.teamMemberId };
      });

      return {
        ...state,
        teamMemberIdByTeamIdByUserId,
        userIdsByTeamId
      };
    }
    case TEAMMEMBER_RECEIVE: {
      const teamMemberIdByTeamIdByUserId = _.cloneDeep(state.teamMemberIdByTeamIdByUserId);
      const userIdsByTeamId = _.cloneDeep(state.userIdsByTeamId);
      const { teamMember, teamId } = action.payload;
      if (!teamMember || !teamMember.userId) return state;

      let teams = teamMemberIdByTeamIdByUserId[teamMember.userId];
      if (!teams) {
        teams = {};
        teamMemberIdByTeamIdByUserId[teamMember.userId] = teams;
      }
      teamMemberIdByTeamIdByUserId[teamMember.userId] = teamMember.teamMemberId;
      let teamMembers = userIdsByTeamId[teamId];
      if (!teamMembers) {
        teamMembers = {};
        userIdsByTeamId[teamId] = teamMembers;
      }
      teamMembers[teamMember.userId] = { teamMemberId: teamMember.teamMemberId };

      return {
        ...state,
        teamMemberIdByTeamIdByUserId,
        userIdsByTeamId
      };
    }
    default:
      return state;
  }
};

export default teamMembersReducer;
