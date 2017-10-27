import _ from 'lodash';
import {
  SUBSCRIBERS_FETCH_SUCCESS,
  TEAMMEMBERS_FETCH_SUCCESS,
  TEAMROOMMEMBERS_FETCH_SUCCESS
} from '../actions';

const INITIAL_STATE = {
  usersByUserId: {}
};

// Merge with existing, since there might be additional information.
function receiverUsers(state, payload) {
  const {
    subscribers, subscriberOrgId,
    teamMembers, teamId,
    teamRoomMembers, teamRoomId
  } = payload;
  const users = subscribers || teamMembers || teamRoomMembers;

  const usersByUserId = _.cloneDeep(state.usersByUserId);
  users.forEach((userIter) => {
    let user = _.clone(userIter);
    const { role, subscriberUserId, teamMemberId, teamRoomMemberId } = user.role;
    delete user.role;
    const existingUser = usersByUserId[user.userId];

    if (existingUser) {
      user = _.merge(existingUser, user);
    } else {
      user.subscriberOrgs = {};
      user.teams = {};
      user.teamRooms = {};
    }
    usersByUserId[user.userId] = user;

    if (subscriberOrgId) {
      let subscriberOrg = user.subscriberOrgs[subscriberOrgId];
      if (!subscriberOrg) {
        subscriberOrg = {};
        user.subscriberOrgs[subscriberOrgId] = subscriberOrg;
      }
      subscriberOrg.role = role;
      subscriberOrg.subscriberUserId = subscriberUserId;
    } else if (teamId) {
      let team = user.teams[teamId];
      if (!team) {
        team = {};
        user.teams[teamId] = team;
      }
      team.role = role;
      team.teamMemberId = teamMemberId;
    } else if (teamRoomId) {
      let teamRoom = user.teamRooms[teamRoomId];
      if (!teamRoom) {
        teamRoom = {};
        user.teamRooms[teamRoomId] = teamRoom;
      }
      teamRoom.role = role;
      teamRoom.teamRoomMemberId = teamRoomMemberId;
    }
  });

  return {
    ...state,
    usersByUserId
  };
}

const usersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SUBSCRIBERS_FETCH_SUCCESS:
      return receiverUsers(state, action.payload);
    case TEAMMEMBERS_FETCH_SUCCESS:
      return receiverUsers(state, action.payload);
    case TEAMROOMMEMBERS_FETCH_SUCCESS:
      return receiverUsers(state, action.payload);
    default:
      return state;
  }
};

export default usersReducer;
