import createCachedSelector from 're-reselect';
import {
  getUserByUserId,
  getUserIdsByTeamRoomId,
  getPresencesByUserId
} from './state';

export {
  getTeamRoomMemberIdByUserId,
  getUserIdsByTeamRoomId
} from './state';

export const getTeamRoomMembersOfTeamRoomId = createCachedSelector(
  [getUserIdsByTeamRoomId, getUserByUserId, (state, teamRoomId) => teamRoomId],
  (userIdsByTeamRoomId, userByUserId, teamRoomId) => {
    if ((!teamRoomId) || (!userIdsByTeamRoomId[teamRoomId])) {
      return [];
    }

    const userIds = userIdsByTeamRoomId[teamRoomId];
    return Object.keys(userIds).map(userId => userByUserId[userId]);
  }
)(
  (state, teamRoomId) => teamRoomId
);

export const getTeamRoomMembersAsObjectsOfTeamRoomId = createCachedSelector(
  [getUserIdsByTeamRoomId, getUserByUserId, (state, teamRoomId) => teamRoomId],
  (userIdsByTeamRoomId, userByUserId, teamRoomId) => {
    if ((!teamRoomId) || (!userIdsByTeamRoomId[teamRoomId])) {
      return {};
    }
    const userIds = userIdsByTeamRoomId[teamRoomId];
    const userIdsObj = Object.keys(userIds).reduce((acc, userId) => { acc[userId] = userByUserId[userId]; return acc; }, {});
    return userIdsObj;
  }
)(
  (state, teamRoomId) => teamRoomId
);

export const getPresencesOfTeamRoomMembersOfTeamRoomId = createCachedSelector(
  [getUserIdsByTeamRoomId, getUserByUserId, getPresencesByUserId, (state, teamRoomId) => teamRoomId],
  (userIdsByTeamRoomId, userByUserId, presencesByUserId, teamRoomId) => {
    if ((!teamRoomId) || (!userIdsByTeamRoomId[teamRoomId])) {
      return {};
    }
    const userIds = userIdsByTeamRoomId[teamRoomId];
    const allPresences = {};
    Object.keys(userIds).forEach((userId) => {
      allPresences[userId] = presencesByUserId[userId];
    });
    return allPresences;
  }
)(
  (state, teamRoomId) => teamRoomId
);
