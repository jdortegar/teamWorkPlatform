import _ from 'lodash';
import { TEAMROOMMEMBERS_FETCH_SUCCESS } from '../actions';

const INITIAL_STATE = {
  teamRoomMemberByUserId: {},
  teamRoomMemberIdIdByUserId: {},
  userIdsByTeamRoomId: {}
};

const teamRoomMembersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TEAMROOMMEMBERS_FETCH_SUCCESS: {
      const teamRoomMemberByUserId = _.cloneDeep(state.teamRoomMemberByUserId);
      const teamRoomMemberIdIdByUserId = _.cloneDeep(state.teamRoomMemberIdIdByUserId);
      const userIdsByTeamRoomId = _.cloneDeep(state.userIdsByTeamRoomId);

      const teamRoomId = action.payload.teamRoomId;
      action.payload.teamRoomMembers.forEach((teamRoomMember) => {
        teamRoomMemberByUserId[teamRoomMember.userId] = teamRoomMember;
        teamRoomMemberIdIdByUserId[teamRoomMember.userId] = teamRoomMember.teamRoomMemberId;
        let teamRoomMembers = userIdsByTeamRoomId[teamRoomId];
        if (!teamRoomMembers) {
          teamRoomMembers = [];
          userIdsByTeamRoomId[teamRoomId] = teamRoomMembers;
        }
        teamRoomMembers.push(teamRoomMember.userId);
      });

      return {
        ...state,
        teamRoomMemberByUserId,
        teamRoomMemberIdIdByUserId,
        userIdsByTeamRoomId
      };
    }
    default:
      return state;
  }
};

export default teamRoomMembersReducer;
