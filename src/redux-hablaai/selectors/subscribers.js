import { createSelector } from 'reselect';

import { getCurrentUserId } from './auth';
import { getTeamsById } from './teams';
import { getUserByUserId, getUserIdsBySubscriberOrgId, getPresencesByUserId, getCurrentSubscriberOrgId } from './state';

export const getCurrentOrgId = getCurrentSubscriberOrgId;

export const getCurrentSubscriberUserId = createSelector(
  [getUserIdsBySubscriberOrgId, getCurrentSubscriberOrgId, getCurrentUserId],
  (userIdsBySubscriberOrgId, subscriberOrgId, userId) => {
    const userIds = userIdsBySubscriberOrgId[subscriberOrgId] || {};
    const { subscriberUserId } = userIds[userId] || {};
    return subscriberUserId;
  }
);

export const getOrgSubscribers = createSelector(
  [getUserIdsBySubscriberOrgId, getUserByUserId, getCurrentOrgId],
  (userIdsBySubscriberOrgId, userByUserId, orgId) => {
    if (!orgId || !userIdsBySubscriberOrgId[orgId]) {
      return [];
    }

    const userIds = userIdsBySubscriberOrgId[orgId];
    return Object.keys(userIds).map(userId => userByUserId[userId]);
  }
);

export const getSubscribersOfTeamId = createSelector(
  [getTeamsById, getUserIdsBySubscriberOrgId, getUserByUserId, (state, teamId) => teamId],
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
);

export const getPresencesOfSubscribersOfOrgId = createSelector(
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
);
