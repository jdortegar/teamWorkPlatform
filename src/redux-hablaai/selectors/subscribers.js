import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';

import { getCurrentUserId } from './auth';
import {
  getUserByUserId,
  getUserIdsBySubscriberOrgId,
  getUserIdsByTeamId,
  getTeamById,
  getTeamRoomById,
  getPresencesByUserId,
  getCurrentSubscriberOrgId
} from './state';

export const getCurrentSubscriberUserId = createSelector(
  [getUserIdsBySubscriberOrgId, getCurrentSubscriberOrgId, getCurrentUserId],
  (userIdsBySubscriberOrgId, subscriberOrgId, userId) => {
    const userIds = userIdsBySubscriberOrgId[subscriberOrgId] || {};
    const { subscriberUserId } = userIds[userId] || {};
    return subscriberUserId;
  }
);

export const getSubscribersOfSubscriberOrgId = createCachedSelector(
  [getUserIdsBySubscriberOrgId, getUserByUserId, (state, subscriberOrgId) => subscriberOrgId],
  (userIdsBySubscriberOrgId, userByUserId, subscriberOrgId) => {
    if (!subscriberOrgId || !userIdsBySubscriberOrgId[subscriberOrgId]) {
      return [];
    }

    const userIds = userIdsBySubscriberOrgId[subscriberOrgId];
    return Object.keys(userIds).map(userId => userByUserId[userId]);
  }
)((state, subscriberOrgId) => subscriberOrgId);

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
)((state, teamId) => teamId);

export const getSubscribersOfTeamRoomId = createCachedSelector(
  [getTeamRoomById, getTeamById, getUserIdsByTeamId, getUserByUserId, (state, teamRoomId) => teamRoomId],
  (teamRoomById, teamById, userIdsByTeamId, userByUserId, teamRoomId) => {
    if (!teamRoomId || !teamRoomById[teamRoomId] || !userIdsByTeamId) {
      return [];
    }

    const teamRoom = teamRoomById[teamRoomId];
    if (!teamRoom) return [];
    const userIds = userIdsByTeamId[teamRoom.teamId];
    if (!userIds) return [];
    return Object.keys(userIds).map(userId => userByUserId[userId]);
  }
)((state, teamRoomId) => teamRoomId);

export const getPresencesOfSubscribersOfOrgId = createCachedSelector(
  [getUserIdsBySubscriberOrgId, getUserByUserId, getPresencesByUserId, (state, subscriberOrgId) => subscriberOrgId],
  (userIdsBySubscriberOrgId, userByUserId, presencesByUserId, subscriberOrgId) => {
    if (!subscriberOrgId || !userIdsBySubscriberOrgId[subscriberOrgId]) {
      return {};
    }
    const userIds = userIdsBySubscriberOrgId[subscriberOrgId];
    const allPresences = {};
    Object.keys(userIds).forEach(userId => {
      allPresences[userId] = presencesByUserId[userId];
    });
    return allPresences;
  }
)((state, subscriberOrgId) => subscriberOrgId);
