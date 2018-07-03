import _ from 'lodash';
import {
  USER_RECEIVE,
  USER_RECEIVE_MYSELF,
  SUBSCRIBERS_FETCH_SUCCESS,
  TEAMMEMBERS_FETCH_SUCCESS,
  TEAMROOMMEMBERS_FETCH_SUCCESS,
  SUBSCRIBER_RECEIVE,
  TEAMMEMBER_RECEIVE,
  TEAMROOMMEMBER_RECEIVE
} from '../actions';

const INITIAL_STATE = {
  userByUserId: {},
  myselfUserId: null
};

// Merge with existing, since there might be additional information.
function receiverUsers(state, payload) {
  const {
    subscribers, subscriberOrgId,
    teamMembers, teamId,
    teamRoomMembers, teamRoomId
  } = payload;
  const users = subscribers || teamMembers || teamRoomMembers;

  const userByUserId = _.cloneDeep(state.userByUserId);
  users.forEach((userIter) => {
    let user = _.clone(userIter);
    delete user.presence; // Presence is maintained in a separate state.
    const { role, subscriberUserId, teamMemberId, teamRoomMemberId } = user;
    delete user.role;
    delete user.subscriberUserId;
    delete user.teamMemberId;
    delete user.teamRoomMemberId;
    const existingUser = userByUserId[user.userId];

    if (existingUser) {
      user = _.merge(existingUser, user);
    } else {
      user.subscriberOrgs = {};
      user.teams = {};
      user.teamRooms = {};
    }
    userByUserId[user.userId] = user;

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
    userByUserId
  };
}

const usersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_RECEIVE:
    case USER_RECEIVE_MYSELF: {
      const myselfUserId = (action.type === USER_RECEIVE_MYSELF) ? action.payload.user.userId : state.myselfUserId;
      const userByUserId = _.cloneDeep(state.userByUserId);
      let user = userByUserId[action.payload.user.userId];
      if (!user) {
        user = action.payload.user;
      } else {
        user = _.merge(user, action.payload.user);
        user.bookmarks = action.payload.user.bookmarks;
      }

      user.subscriberOrgs = user.subscriberOrgs || {};
      user.teams = user.teams || {};
      user.teamRooms = user.teamRooms || {};
      userByUserId[action.payload.user.userId] = user;

      return {
        ...state,
        userByUserId,
        myselfUserId
      };
    }
    case SUBSCRIBERS_FETCH_SUCCESS:
    case TEAMMEMBERS_FETCH_SUCCESS:
    case TEAMROOMMEMBERS_FETCH_SUCCESS:
      return receiverUsers(state, action.payload);
    case SUBSCRIBER_RECEIVE:
    case TEAMMEMBER_RECEIVE:
    case TEAMROOMMEMBER_RECEIVE: {
      const userByUserId = _.cloneDeep(state.userByUserId);
      const {
        subscriber,
        teamMember,
        teamRoomMember,
        subscriberOrgId,
        teamId,
        teamRoomId
      } = action.payload;

      let userId;
      if (subscriber) {
        userId = subscriber.userId;
      } else if (teamMember) {
        userId = teamMember.userId;
      } else if (teamRoomMember) {
        userId = teamRoomMember.userId;
      }
      let user = userByUserId[userId];
      if (!user) {
        user = subscriber || teamMember || teamRoomMember;
        user.subscriberOrgs = user.subscriberOrgs || {};
        user.teams = user.teams || {};
        user.teamRooms = user.teamRooms || {};
      } else {
        user = _.merge(user, subscriber, teamMember, teamRoomMember);
      }
      userByUserId[userId] = user;

      const { role, subscriberUserId, teamMemberId, teamRoomMemberId } = user;
      delete user.role;
      delete user.subscriberUserId;
      delete user.teamMemberId;
      delete user.teamRoomMemberId;
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

      return {
        ...state,
        userByUserId
      };
    }
    default:
      return state;
  }
};

export default usersReducer;
