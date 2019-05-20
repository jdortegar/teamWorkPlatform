import { createSelector } from 'reselect';
import { getUserByUserId } from './state';
import { getCurrentUserId } from './auth';
import { getCurrentUserTeams } from './teams';
import { getCurrentOrgId } from './subscribers';

export { getUserByUserId, getPresencesByUserId } from './state';

export const getCurrentUser = createSelector(
  [getUserByUserId, getCurrentUserId],
  (userByUserId, currentUserId) => userByUserId[currentUserId]
);

export const isSmartChatEnabled = createSelector(
  [getUserByUserId, getCurrentUserId],
  (userByUserId, currentUserId) => {
    const user = userByUserId[currentUserId] || {};
    const { smartChat } = user.preferences || {};
    return smartChat === undefined ? true : smartChat;
  }
);

export const getUserFullName = createSelector(
  [getUserByUserId, (state, userId) => userId],
  (usersByUserId, userId) => (usersByUserId[userId] ? usersByUserId[userId].fullName : '')
);

export const getCurrentUserFirstName = createSelector(
  getCurrentUser,
  currentUser => (currentUser ? currentUser.firstName : '')
);

export const getUserById = createSelector(
  [getUserByUserId, (state, userId) => userId],
  (usersByUserId, userId) => usersByUserId[userId]
);

export const getUserRoles = createSelector(
  [getCurrentUser, getCurrentUserTeams, getCurrentOrgId],
  (currentUser, teams, orgId) => {
    const userRoles = {};
    userRoles.teamOwner = teams.filter(team => team.teamAdmin === currentUser.userId).map(team => team.teamId);
    const { subscriberOrgs = {} } = currentUser || {};
    const { role } = subscriberOrgs[orgId] || {};
    if (role === 'admin') {
      userRoles.admin = true;
    }
    return userRoles;
  }
);
