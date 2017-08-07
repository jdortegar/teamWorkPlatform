import _ from 'lodash';
import {
  REQUESTING_TEAM_ROOM_MEMBERS,
  RECEIVE_TEAM_ROOM_MEMBERS,
  REQUEST_TEAM_ROOM_MEMBERS_ERROR
} from '../actions/types';

const INITIAL_STATE = {
  teamRoomMembersByTeamRoomId: {}, // TODO: deprecated.  Remove when using selector instead.
  teamRoomMemberUserIdsByTeamRoomId: {},

  received: false,
  requesting: false,
  error: null,
  errorMeta: {}
};

const teamRoomMembersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REQUESTING_TEAM_ROOM_MEMBERS:
      return {
        ...state,
        received: false,
        requesting: true,
        error: null,
        errorMeta: {}
      };
    case RECEIVE_TEAM_ROOM_MEMBERS: {
      const teamRoomMembersByTeamRoomId = _.cloneDeep(state.teamRoomMembersByTeamRoomId);
      teamRoomMembersByTeamRoomId[action.payload.teamRoomId] = action.payload.teamRoomMembers;

      const teamRoomMemberUserIdsByTeamRoomId = _.cloneDeep(state.teamRoomMemberUserIdsByTeamRoomId);
      teamRoomMemberUserIdsByTeamRoomId[action.payload.teamRoomId] = action.payload.teamRoomMembers.map(teamRoomMember => teamRoomMember.userId);

      return {
        ...state,
        teamRoomMembersByTeamRoomId,
        teamRoomMemberUserIdsByTeamRoomId,
        received: true,
        requesting: false,
        error: null,
        errorMeta: {}
      };
    }
    case REQUEST_TEAM_ROOM_MEMBERS_ERROR:
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

export default teamRoomMembersReducer;
