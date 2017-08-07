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
function receiverUsers(state, users, appliesTo) {
  const usersByUserId = _.cloneDeep(state.usersByUserId);
  users.forEach((userIter) => {
    const user = _.clone(userIter);
    const isAdmin = (user.role === 'admin');
    const existing = usersByUserId[user.userId];
    delete user.role;

    let adminOf;
    if (existing) {
      adminOf = existing.adminOf;
    } else {
      usersByUserId[user.userId] = user;
      adminOf = {};
      user.adminOf = adminOf;
    }

    if (isAdmin) {
      adminOf[appliesTo] = true;
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
  const appliesTo = subscriberOrgId || teamId || teamRoomId;
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
