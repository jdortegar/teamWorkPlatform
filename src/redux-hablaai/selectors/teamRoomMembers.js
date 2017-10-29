import createCachedSelector from 're-reselect';
import {
  getUsersByUserId,
  getUserIdsByTeamRoomId
} from './state';

export {
  getTeamRoomMemberIdByUserId,
  getUserIdsByTeamRoomId
} from './state';

export const getTeamRoomMembersOfTeamRoomId = createCachedSelector(
  [getUserIdsByTeamRoomId, getUsersByUserId, (state, teamRoomId) => teamRoomId],
  (userIdsByTeamRoomId, usersByUserId, teamRoomId) => {
    if ((!teamRoomId) || (!userIdsByTeamRoomId[teamRoomId])) {
      return [];
    }

    const userIds = userIdsByTeamRoomId[teamRoomId];
    return Object.keys(userIds).map(userId => usersByUserId[userId]);
  }
)(
  (state, teamRoomId) => teamRoomId
);

export const getTeamRoomMembersAsObjectsOfTeamRoomId = createCachedSelector(
  [getUserIdsByTeamRoomId, getUsersByUserId, (state, teamRoomId) => teamRoomId],
  (userIdsByTeamRoomId, usersByUserId, teamRoomId) => {
    if ((!teamRoomId) || (!userIdsByTeamRoomId[teamRoomId])) {
      return {};
    }
    const userIds = userIdsByTeamRoomId[teamRoomId];
    const userIdsObj = Object.keys(userIds).reduce((acc, userId) => { acc[userId] = usersByUserId[userId]; return acc; }, {});
    return userIdsObj;
  }
)(
  (state, teamRoomId) => teamRoomId
);
