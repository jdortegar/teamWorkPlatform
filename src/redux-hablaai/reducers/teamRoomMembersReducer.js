import _ from 'lodash';
import { TEAMROOMMEMBERS_FETCH_SUCCESS, TEAMROOMMEMBER_RECEIVE } from 'src/actions';

const INITIAL_STATE = {
  teamRoomMemberIdByUserId: {},
  userIdsByTeamRoomId: {}
};

const teamRoomMembersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TEAMROOMMEMBERS_FETCH_SUCCESS: {
      const teamRoomMemberIdByUserId = _.cloneDeep(state.teamRoomMemberIdByUserId);
      const userIdsByTeamRoomId = _.cloneDeep(state.userIdsByTeamRoomId);

      const { teamRoomId } = action.payload;
      action.payload.teamRoomMembers.forEach(teamRoomMember => {
        teamRoomMemberIdByUserId[teamRoomMember.userId] = teamRoomMember.teamRoomMemberId;
        let teamRoomMembers = userIdsByTeamRoomId[teamRoomId];
        if (!teamRoomMembers) {
          teamRoomMembers = {};
          userIdsByTeamRoomId[teamRoomId] = teamRoomMembers;
        }
        teamRoomMembers[teamRoomMember.userId] = { teamRoomMemberId: teamRoomMember.teamRoomMemberId };
      });

      return {
        ...state,
        teamRoomMemberIdByUserId,
        userIdsByTeamRoomId
      };
    }
    case TEAMROOMMEMBER_RECEIVE: {
      const teamRoomMemberIdByUserId = _.cloneDeep(state.teamRoomMemberIdByUserId);
      const userIdsByTeamRoomId = _.cloneDeep(state.userIdsByTeamRoomId);
      const { teamRoomMember, teamRoomId } = action.payload;

      teamRoomMemberIdByUserId[teamRoomMember.userId] = teamRoomMember.teamRoomMemberId;
      let teamRoomMembers = userIdsByTeamRoomId[teamRoomId];
      if (!teamRoomMembers) {
        teamRoomMembers = {};
        userIdsByTeamRoomId[teamRoomId] = teamRoomMembers;
      }
      teamRoomMembers[teamRoomMember.userId] = { teamRoomMemberId: teamRoomMember.teamRoomMemberId };

      return {
        ...state,
        teamRoomMemberIdByUserId,
        userIdsByTeamRoomId
      };
    }
    default:
      return state;
  }
};

export default teamRoomMembersReducer;
