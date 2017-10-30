import _ from 'lodash';
import { TEAMROOMMEMBERS_FETCH_SUCCESS } from '../actions';

const INITIAL_STATE = {
  teamRoomMemberIdByUserId: {},
  userIdsByTeamRoomId: {}
};

const teamRoomMembersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TEAMROOMMEMBERS_FETCH_SUCCESS: {
      const teamRoomMemberIdByUserId = _.cloneDeep(state.teamRoomMemberIdByUserId);
      const userIdsByTeamRoomId = _.cloneDeep(state.userIdsByTeamRoomId);

      const teamRoomId = action.payload.teamRoomId;
      action.payload.teamRoomMembers.forEach((teamRoomMember) => {
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
    default:
      return state;
  }
};

export default teamRoomMembersReducer;
