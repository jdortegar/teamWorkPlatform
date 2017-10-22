import _ from 'lodash';
import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';

// ------- Directly from state. START
export const getUrlRequests = state => state.urlRequests;

const getCurrentUser = state => state.auth.user;
const getUsersByUserId = state => state.users.usersByUserId;

const getSubscriberOrgById = state => state.subscriberOrgs.subscriberOrgById;
export const getCurrentSubscriberOrgId = state => state.subsriberOrgs.currentSubscriberOrgId;
const getSubscriberUserIdsBySubscriberOrgId = state => state.subscribers.subscriberUserIdsBySubscriberOrgId;

const getTeamById = state => state.teams.teamById;
const getTeamIdsBySubscriberOrgId = state => state.teams.teamIdsBySubscriberOrgId;
const getCurrentTeamIdBySubscriberOrgId = state => state.teams.currentTeamIdBySubscriberOrgId;
const getTeamMemberUserIdsByTeamId = state => state.teamMembers.teamMemberUserIdsByTeamId;

const getTeamRoomById = state => state.teamRooms.teamRoomById;
const getTeamRoomIdsByTeamId = state => state.teamRooms.teamRoomIdsByTeamId;
const getCurrentTeamRoomIdByTeamId = state => state.teamRooms.currentTeamRoomIdByTeamId;
const getTeamRoomMemberUserIdsByTeamRoomId = state => state.teamRoomMembers.teamRoomMemberUserIdsByTeamRoomId;

const getConversationById = state => state.conversations.conversationById;
const getConversationIdsByTeamRoomId = state => state.conversations.conversationIdsByTeamRoomId;
const getActiveConverationId = state => state.conversations.activeConversationId;

const getIntegrationsBySubscriberOrgId = state => state.integrations.integrationsBySubscriberOrgId;
// ------- Directly from state. END


export const getUrlRequestStatus = createCachedSelector(
  [getUrlRequests, (state, requestUrl) => requestUrl],
  (urlRequests, requestUrl) => {
    return urlRequests[requestUrl];
  }
)(
  (state, requestUrl) => requestUrl
);

/**
 * Return array of subscriberOrgs.
 */
export const getSubscriberOrgs = createSelector(
  [getSubscriberOrgById],
  (subscriberOrgById) => {
    return Object.values(subscriberOrgById);
  }
);

export const getCurrentSubscriberOrg = createSelector(
  [getCurrentSubscriberOrgId, getSubscriberOrgById],
  (currentSubscriberOrgId, subscriberOrgById) => {
    return (currentSubscriberOrgId) ? subscriberOrgById[currentSubscriberOrgId] : null;
  }
);

export const getSubscribersOfSubscriberOrgId = createCachedSelector(
  [getSubscriberUserIdsBySubscriberOrgId, getUsersByUserId, (state, subscriberOrgId) => subscriberOrgId],
  (subscriberUserIdsBySubscriberOrgId, usersByUserId, subscriberOrgId) => {
    if ((!subscriberOrgId) || (!subscriberUserIdsBySubscriberOrgId[subscriberOrgId])) {
      return [];
    }

    const userIds = subscriberUserIdsBySubscriberOrgId[subscriberOrgId];
    return userIds.map(userId => usersByUserId[userId]);
  }
)(
  (state, subscriberOrgId) => subscriberOrgId
);


/**
 * Return user details, as well as orgs, teams, and team rooms.
 * This is "deep" details, where orgs, teams, and team rooms are realized.
 * Note that this information needs to be in redux.  Refer to actions fetchSubscriberOrgs, requestAllTeams, and
 * requestAllTeamRooms.
 *
 * If the return is undefined, you'll have to wait until all relevant info is obtained by the described actions.
 */
export const getUserDetailsByUserId = createCachedSelector(
  [getUsersByUserId, getSubscriberOrgById, getTeamById, getTeamRoomById, (state, userId) => userId],
  (usersByUserId, subscriberOrgById, teamById, teamRoomById, userId) => {
    if ((!userId) || (!usersByUserId[userId])) {
      return undefined;
    }

    const user = usersByUserId[userId];
    if (!user) {
      return undefined;
    }

    const subscriberOrgs = {};
    Object.keys(user.subscriberOrgs).forEach((subscriberOrgId) => {
      const role = user.subscriberOrgs[subscriberOrgId];
      let subscriberOrg = subscriberOrgById[subscriberOrgId];
      subscriberOrg = subscriberOrg || {};
      subscriberOrg.role = role;
      subscriberOrgs[subscriberOrgId] = subscriberOrg;
    });
    user.subscriberOrgs = subscriberOrgs;

    const teams = {};
    Object.keys(user.teams).forEach((teamId) => {
      const role = user.teams[teamId];
      let team = teamById[teamId];
      const subscriberOrgId = (team) ? team.subscriberOrgId : undefined;
      if (subscriberOrgId) {
        let teamsForSubscriberOrg = teams[subscriberOrgId];
        if (!teamsForSubscriberOrg) {
          teamsForSubscriberOrg = [];
          teams[subscriberOrgId] = teamsForSubscriberOrg;
        }

        team = _.cloneDeep(team);
        team.role = role;
        teamsForSubscriberOrg.push(team);
      }
    });
    user.teams = teams;

    const teamRooms = {};
    Object.keys(user.teamRooms).forEach((teamRoomId) => {
      const role = user.teamRooms[teamRoomId];
      let teamRoom = teamRoomById[teamRoomId];
      const teamId = (teamRoom) ? teamRoom.teamId : undefined;
      if (teamId) {
        let teamRoomsForTeam = teamRooms[teamId];
        if (!teamRoomsForTeam) {
          teamRoomsForTeam = [];
          teamRooms[teamId] = teamRoomsForTeam;
        }

        teamRoom = _.cloneDeep(teamRoom);
        teamRoom.role = role;
        teamRoomsForTeam.push(teamRoom);
      }
    });
    user.teamRooms = teamRooms;

    return user;
  }
)(
  (state, userId) => userId
);


/**
 * Return array of teams for the current subscriberOrg.
 */
export const getCurrentTeams = createSelector(
  [getCurrentSubscriberOrgId, getCurrentTeamIdBySubscriberOrgId, getTeamById],
  (currentSubscriberOrgId, currentTeamIdBySubscriberOrgId, teamById) => {
    if ((currentSubscriberOrgId) && (currentTeamIdBySubscriberOrgId[currentSubscriberOrgId])) {
      const teamIds = currentTeamIdBySubscriberOrgId[currentSubscriberOrgId];
      return teamIds.map(teamId => teamById[teamId]);
    }
    return [];
  }
);

export const getCurrentTeamId = createSelector(
  [getCurrentSubscriberOrgId, getCurrentTeamIdBySubscriberOrgId],
  (currentSubscriberOrgId, currentTeamIdBySubscriberOrgId) => {
    if ((!currentSubscriberOrgId) || (!currentTeamIdBySubscriberOrgId[currentSubscriberOrgId])) {
      return null;
    }

    return currentTeamIdBySubscriberOrgId[currentSubscriberOrgId];
  }
);

export const getCurrentTeam = createSelector(
  [getCurrentTeamId, getTeamById],
  (currentTeamId, teamById) => {
    return (currentTeamId) ? teamById[currentTeamId] : null;
  }
);

/**
 * Return array of teams given a subscriberOrgId.
 *
 * @type {OutputSelector<any, any, (res: any) => any> & {getMatchingSelector: ((null: any, ...null: any[]) => OutputSelector<any, any, (res: any) => any>); removeMatchingSelector: ((null: any, ...null: any[]) => void); clearCache: (() => void); resultFunc: ((res: any) => any)}}
 */
export const getTeamsOfSubscriberOrgId = createCachedSelector(
  [getTeamIdsBySubscriberOrgId, getTeamById, (state, subscriberOrgId) => subscriberOrgId],
  (teamIdsBySubscriberOrgId, teamById, subscriberOrgId) => {
    if ((!subscriberOrgId) || (!teamIdsBySubscriberOrgId[subscriberOrgId])) {
      return []; // TODO: null (to differentiate from valid data).  Also, elsewhere.
    }

    const teamIds = teamIdsBySubscriberOrgId[subscriberOrgId];
    return teamIds.map(teamId => teamById[teamId]);
  }
)(
  (state, subscriberOrgId) => subscriberOrgId
);

export const getTeamMembersOfTeamId = createCachedSelector(
  [getTeamMemberUserIdsByTeamId, getUsersByUserId, (state, teamId) => teamId],
  (teamMemberUserIdsByTeamId, usersByUserId, teamId) => {
    if ((!teamId) || (!teamMemberUserIdsByTeamId[teamId])) {
      return [];
    }

    const userIds = teamMemberUserIdsByTeamId[teamId];
    return userIds.map(userId => usersByUserId[userId]);
  }
)(
  (state, teamId) => teamId
);


/**
 * Return array of team rooms for the current subscriberOrg and current team of the current subscriberOrg.
 */
export const getCurrentTeamRooms = createSelector(
  [getCurrentSubscriberOrgId, getCurrentTeamIdBySubscriberOrgId, getCurrentTeamRoomIdByTeamId, getTeamRoomIdsByTeamId, getTeamRoomById],
  (currentSubscriberOrgId, currentTeamIdBySubscriberOrgId, currentTeamRoomIdByTeamId, teamRoomIdsByTeamId, teamRoomById) => {
    if (!currentSubscriberOrgId) {
      return [];
    }
    const currentTeamId = currentTeamIdBySubscriberOrgId[currentSubscriberOrgId];
    if (!currentTeamId) {
      return [];
    }
    const currentTeamRoomId = currentTeamRoomIdByTeamId[currentTeamId];
    if (!currentTeamRoomId) {
      return [];
    }

    const teamRoomIds = teamRoomIdsByTeamId[currentTeamId];
    return teamRoomIds.map(teamRoomId => teamRoomById[teamRoomId]);
  }
);

export const getCurrentTeamRoomId = createSelector(
  [getCurrentSubscriberOrgId, getCurrentTeamIdBySubscriberOrgId, getCurrentTeamRoomIdByTeamId],
  (currentSubscriberOrgId, currentTeamIdBySubscriberOrgId, currentTeamRoomIdByTeamId) => {
    if (!currentSubscriberOrgId) {
      return null;
    }
    const currentTeamId = currentTeamIdBySubscriberOrgId[currentSubscriberOrgId];
    if (!currentTeamId) {
      return null;
    }
    const currentTeamRoomId = currentTeamRoomIdByTeamId[currentTeamId];
    if (!currentTeamRoomId) {
      return null;
    }
    return currentTeamIdBySubscriberOrgId[currentSubscriberOrgId];
  }
);

export const getCurrentTeamRoom = createSelector(
  [getCurrentTeamRoomId, getTeamRoomById],
  (currentTeamRoomId, teamRoomById) => {
    return (currentTeamRoomId) ? teamRoomById[currentTeamRoomId] : null;
  }
);

/**
 * Return array of team rooms given a teamId.
 *
 * @type {OutputSelector<any, any, (res: any) => any> & {getMatchingSelector: ((null: any, ...null: any[]) => OutputSelector<any, any, (res: any) => any>); removeMatchingSelector: ((null: any, ...null: any[]) => void); clearCache: (() => void); resultFunc: ((res: any) => any)}}
 */
export const getTeamRoomsOfTeamId = createCachedSelector(
  [getTeamRoomIdsByTeamId, getTeamRoomById, (state, teamId) => teamId],
  (teamRoomIdsByTeamId, teamRoomById, teamId) => {
    if ((!teamId) || (!teamRoomIdsByTeamId[teamId])) {
      return [];
    }

    const teamRoomIds = teamRoomIdsByTeamId[teamId];
    return teamRoomIds.map(teamRoomId => teamRoomById[teamRoomId]);
  }
)(
  (state, teamId) => teamId
);

export const getTeamRoomMembersOfTeamRoomId = createCachedSelector(
  [getTeamRoomMemberUserIdsByTeamRoomId, getUsersByUserId, (state, teamRoomId) => teamRoomId],
  (teamRoomMemberUserIdsByTeamRoomId, usersByUserId, teamRoomId) => {
    if ((!teamRoomId) || (!teamRoomMemberUserIdsByTeamRoomId[teamRoomId])) {
      return [];
    }

    const userIds = teamRoomMemberUserIdsByTeamRoomId[teamRoomId];
    return userIds.map(userId => usersByUserId[userId]);
  }
)(
  (state, teamRoomId) => teamRoomId
);

export const getTeamRoomMembersAsObjectsOfTeamRoomId = createCachedSelector(
  [getTeamRoomMemberUserIdsByTeamRoomId, getUsersByUserId, (state, teamRoomId) => teamRoomId],
  (teamRoomMemberUserIdsByTeamRoomId, usersByUserId, teamRoomId) => {
    if ((!teamRoomId) || (!teamRoomMemberUserIdsByTeamRoomId[teamRoomId])) {
      return {};
    }
    const userIds = teamRoomMemberUserIdsByTeamRoomId[teamRoomId];
    const userIdsObj = userIds.reduce((acc, userId) => { acc[userId] = usersByUserId[userId]; return acc; }, {});
    return userIdsObj;
  }
)(
  (state, teamRoomId) => teamRoomId
);

function merge(tree, messages) {
  const ret = [];
  tree.forEach((node) => {
    const merged = _.merge({}, messages[node.messageId], node);
    ret.push(merged);
    if (node.children.length > 0) {
      merged.children = merge(node.children, messages);
    }
  });
  return ret;
}

export const getConversationOfTeamRoomId = createCachedSelector(
  [getConversationIdsByTeamRoomId, getConversationById, (state, teamRoomId) => teamRoomId],
  (conversationIdsByTeamRoomId, conversationById, teamRoomId) => {
    const conversationIds = conversationIdsByTeamRoomId[teamRoomId];
    if ((!conversationIds) || (conversationIds.length === 0)) {
      return null;
    }

    // Only 1 conversation per team room, currently.
    const conversation = conversationById[conversationIds[0]];

    if ((conversation) && (conversation.transcript)) {
      // Merge transcript messages into tree, and just replace transcript with tree in clone.
      const clone = {};
      Object.keys(conversation).forEach((key) => {
        if (key !== 'transcript') {
          clone[key] = conversation[key];
        }
      });
      clone.transcript = merge(conversation.transcript.flattenedTree, conversation.transcript.messages);
      return clone;
    }

    return null;
  }
)(
  (state, teamRoomId) => teamRoomId
);

export const getIntegrationsOfSubscriberOrgId = createCachedSelector(
  [getIntegrationsBySubscriberOrgId, (state, subscriberOrgId) => subscriberOrgId],
  (integrationsBySubscriberOrgId, subscriberOrgId) => {
    const integrations = integrationsBySubscriberOrgId[subscriberOrgId];
    return integrations || {};
  }
)(
  (state, subscriberOrgId) => subscriberOrgId
);
