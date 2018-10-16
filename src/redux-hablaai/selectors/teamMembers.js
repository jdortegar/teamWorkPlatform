import createCachedSelector from 're-reselect';
import { getUserByUserId, getUserIdsByTeamId, getPresencesByUserId } from './state';
import { sortByFirstName } from './helpers';

export { getUserIdsByTeamId } from './state';

export const getTeamMembersOfTeamId = createCachedSelector(
  [getUserIdsByTeamId, getUserByUserId, (state, teamId) => teamId],
  (userIdsByTeamId, userByUserId, teamId) => {
    if (!teamId || !userIdsByTeamId[teamId]) {
      return [];
    }

    const userIds = userIdsByTeamId[teamId];
    return Object.keys(userIds)
      .map(userId => userByUserId[userId])
      .sort(sortByFirstName);
  }
)((state, teamId) => teamId);

export const getPresencesOfTeamMembersOfTeamId = createCachedSelector(
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
)((state, teamId) => teamId);
