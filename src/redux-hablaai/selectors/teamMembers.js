import { createSelector } from 'reselect';
import { getUserByUserId, getUserIdsByTeamId, getPresencesByUserId } from './state';

export { getUserIdsByTeamId } from './state';

export const getTeamMembersOfTeamId = createSelector(
  [getUserIdsByTeamId, getUserByUserId, (state, teamId) => teamId],
  (userIdsByTeamId, userByUserId, teamId) => {
    if (!teamId || !userIdsByTeamId[teamId]) {
      return [];
    }

    return userIdsByTeamId[teamId];
  }
);

export const getPresencesOfTeamMembersOfTeamId = createSelector(
  [getUserIdsByTeamId, getUserByUserId, getPresencesByUserId, (state, teamId) => teamId],
  (userIdsByTeamId, userByUserId, presencesByUserId, teamId) => {
    if (!teamId || !userIdsByTeamId[teamId]) {
      return {};
    }
    const userIds = userIdsByTeamId[teamId];
    const allPresences = {};
    Object.keys(userIds).forEach(userId => {
      allPresences[userId] = presencesByUserId[userId];
    });
    return allPresences;
  }
);
