import _ from 'lodash';
import String from 'src/translations';
import {
  USER_RECEIVE,
  SUBSCRIBERS_FETCH_SUCCESS,
  TEAMMEMBERS_FETCH_SUCCESS,
  SUBSCRIBER_RECEIVE,
  TEAMMEMBER_RECEIVE
} from 'src/actions';

const INITIAL_STATE = {
  userByUserId: {}
};

// Merge with existing, since there might be additional information.
function receiverUsers(state, payload) {
  const { subscribers, subscriberOrgId, teamMembers, teamId } = payload;
  const users = subscribers || teamMembers;

  const userByUserId = _.cloneDeep(state.userByUserId);
  users.forEach(userIter => {
    let user = _.clone(userIter);
    delete user.presence; // Presence is maintained in a separate state.
    const { role, subscriberUserId, teamMemberId } = user;
    delete user.role;
    delete user.subscriberUserId;
    delete user.teamMemberId;
    const existingUser = userByUserId[user.userId];

    if (existingUser) {
      user = _.merge(existingUser, user);
    } else {
      user.subscriberOrgs = {};
      user.teams = {};
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
    }

    const { firstName, lastName } = user;
    user.fullName = String.t('fullName', { firstName, lastName });
  });

  return {
    ...state,
    userByUserId
  };
}

const usersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_RECEIVE: {
      const userByUserId = _.cloneDeep(state.userByUserId);
      let user = userByUserId[action.payload.user.userId];
      if (!user) {
        user = action.payload.user; // eslint-disable-line prefer-destructuring
      } else {
        user = _.merge(user, action.payload.user);
        user.bookmarks = action.payload.user.bookmarks;
      }

      user.subscriberOrgs = user.subscriberOrgs || {};
      user.teams = user.teams || {};
      userByUserId[action.payload.user.userId] = user;

      const { firstName, lastName } = user;
      user.fullName = String.t('fullName', { firstName, lastName });

      return {
        ...state,
        userByUserId
      };
    }
    case SUBSCRIBERS_FETCH_SUCCESS:
    case TEAMMEMBERS_FETCH_SUCCESS:
      return receiverUsers(state, action.payload);
    case SUBSCRIBER_RECEIVE:
    case TEAMMEMBER_RECEIVE: {
      const userByUserId = _.cloneDeep(state.userByUserId);
      const { subscriber, teamMember, subscriberOrgId, teamId } = action.payload;

      let userId;
      if (subscriber) {
        userId = subscriber.userId; // eslint-disable-line prefer-destructuring
      } else if (teamMember) {
        userId = teamMember.userId; // eslint-disable-line prefer-destructuring
      }
      let user = userByUserId[userId];
      if (!user) {
        user = subscriber || teamMember;
        user.subscriberOrgs = user.subscriberOrgs || {};
        user.teams = user.teams || {};
      } else {
        user = _.merge(user, subscriber, teamMember);
      }
      userByUserId[userId] = user;

      const { role, subscriberUserId, teamMemberId } = user;
      delete user.role;
      delete user.subscriberUserId;
      delete user.teamMemberId;
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
      }

      const { firstName, lastName } = user;
      user.fullName = String.t('fullName', { firstName, lastName });

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
