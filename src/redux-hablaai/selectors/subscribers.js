import createCachedSelector from 're-reselect';
import {
  getUsersByUserId,
  getUserIdsBySubscriberOrgId,
  getTeamById,
  getTeamRoomById
} from './state';

export {
  getSubscriberUserIdByUserId
} from './state';

export const getSubscribersOfSubscriberOrgId = createCachedSelector(
  [getUserIdsBySubscriberOrgId, getUsersByUserId, (state, subscriberOrgId) => subscriberOrgId],
  (userIdsBySubscriberOrgId, usersByUserId, subscriberOrgId) => {
    if ((!subscriberOrgId) || (!userIdsBySubscriberOrgId[subscriberOrgId])) {
      return [];
    }

    const userIds = userIdsBySubscriberOrgId[subscriberOrgId];
    return Object.keys(userIds).map(userId => usersByUserId[userId]);
  }
)(
  (state, subscriberOrgId) => subscriberOrgId
);

export const getSubscribersOfTeamId = createCachedSelector(
  [getTeamById, getUserIdsBySubscriberOrgId, getUsersByUserId, (state, teamId) => teamId],
  (teamById, userIdsBySubscriberOrgId, usersByUserId, teamId) => {
    if ((!teamId) || (!teamById[teamId])) {
      return [];
    }

    const team = teamById[teamId];
    const subscriberOrgId = team.subscriberOrgId;
    const userIds = userIdsBySubscriberOrgId[subscriberOrgId];
    return Object.keys(userIds).map(userId => usersByUserId[userId]);
  }
)(
  (state, teamId) => teamId
);

export const getSubscribersOfTeamRoomId = createCachedSelector(
  [getTeamRoomById, getTeamById, getUserIdsBySubscriberOrgId, getUsersByUserId, (state, teamRoomId) => teamRoomId],
  (teamRoomById, teamById, userIdsBySubscriberOrgId, usersByUserId, teamRoomId) => {
    if ((!teamRoomId) || (!teamRoomById[teamRoomId])) {
      return [];
    }

    const teamRoom = teamRoomById[teamRoomId];
    const team = teamById[teamRoom.teamId];
    const subscriberOrgId = team.subscriberOrgId;
    const userIds = userIdsBySubscriberOrgId[subscriberOrgId];
    return Object.keys(userIds).map(userId => usersByUserId[userId]);
  }
)(
  (state, teamRoomId) => teamRoomId
);
