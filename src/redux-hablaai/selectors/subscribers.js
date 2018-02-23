import createCachedSelector from 're-reselect';
import {
  getUserByUserId,
  getUserIdsBySubscriberOrgId,
  getTeamById,
  getTeamRoomById
} from './state';

export {
  getSubscriberUserIdByUserId
} from './state';

export const getSubscribersOfSubscriberOrgId = createCachedSelector(
  [getUserIdsBySubscriberOrgId, getUserByUserId, (state, subscriberOrgId) => subscriberOrgId],
  (userIdsBySubscriberOrgId, userByUserId, subscriberOrgId) => {
    if ((!subscriberOrgId) || (!userIdsBySubscriberOrgId[subscriberOrgId])) {
      return [];
    }

    const userIds = userIdsBySubscriberOrgId[subscriberOrgId];
    return Object.keys(userIds).map(userId => userByUserId[userId]);
  }
)(
  (state, subscriberOrgId) => subscriberOrgId
);

export const getSubscribersOfTeamId = createCachedSelector(
  [getTeamById, getUserIdsBySubscriberOrgId, getUserByUserId, (state, teamId) => teamId],
  (teamById, userIdsBySubscriberOrgId, userByUserId, teamId) => {
    if (!teamId || !teamById[teamId] || !userIdsBySubscriberOrgId) {
      return [];
    }

    const team = teamById[teamId];
    if (!team || !team.subscriberOrgId) return [];
    const userIds = userIdsBySubscriberOrgId[team.subscriberOrgId];
    if (!userIds) return [];
    return Object.keys(userIds).map(userId => userByUserId[userId]);
  }
)(
  (state, teamId) => teamId
);

export const getSubscribersOfTeamRoomId = createCachedSelector(
  [getTeamRoomById, getTeamById, getUserIdsBySubscriberOrgId, getUserByUserId, (state, teamRoomId) => teamRoomId],
  (teamRoomById, teamById, userIdsBySubscriberOrgId, userByUserId, teamRoomId) => {
    if (!teamRoomId || !teamRoomById[teamRoomId] || !userIdsBySubscriberOrgId) {
      return [];
    }

    const teamRoom = teamRoomById[teamRoomId];
    if (!teamRoom) return [];
    const team = teamById[teamRoom.teamId];
    if (!team || !team.subscriberOrgId) return [];
    const userIds = userIdsBySubscriberOrgId[team.subscriberOrgId];
    if (!userIds) return [];
    return Object.keys(userIds).map(userId => userByUserId[userId]);
  }
)(
  (state, teamRoomId) => teamRoomId
);
