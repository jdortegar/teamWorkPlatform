import _ from 'lodash';
import {
  RECEIVE_SUBSCRIBERS,
  RECEIVE_TEAM_MEMBERS,
  RECEIVE_TEAM_ROOM_MEMBERS
} from '../actions/types';

const INITIAL_STATE = {
  usersByUserId: {}
};

// Merge with existing, since there might be additional information.
function receiverUsers(state, users, { subscriberOrgId, teamId, teamRoomId }) {
  const usersByUserId = _.cloneDeep(state.usersByUserId);
  users.forEach((userIter) => {
    let user = _.clone(userIter);
    const role = user.role;
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
    } else if (teamId) {
      let team = user.teams[teamId];
      if (!team) {
        team = {};
        user.teams[teamId] = team;
      }
      team.role = role;
    } else if (teamRoomId) {
      let teamRoom = user.teamRooms[teamRoomId];
      if (!teamRoom) {
        teamRoom = {};
        user.teamRooms[teamRoomId] = teamRoom;
      }
      teamRoom.role = role;
    }
  });

  return {
    ...state,
    usersByUserId
  };
}

const usersReducer = (state = INITIAL_STATE, action) => {
  const {
    subscribers, subscriberOrgId,
    teamMembers, teamId,
    teamRoomMembers, teamRoomId
  } = action.payload;
  const appliesTo = { subscriberOrgId, teamId, teamRoomId };
  switch (action.type) {
    case RECEIVE_SUBSCRIBERS:
      return receiverUsers(state, subscribers, appliesTo);
    case RECEIVE_TEAM_MEMBERS:
      return receiverUsers(state, teamMembers, appliesTo);
    case RECEIVE_TEAM_ROOM_MEMBERS:
      return receiverUsers(state, teamRoomMembers, appliesTo);
    default:
      return state;
  }
};

export default usersReducer;
