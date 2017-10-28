import _ from 'lodash';
import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import {
  sortByName,
  primaryAtTop,
} from './helpers';

// ------- Directly from state. START
export const getUrlRequests = state => state.urlRequests;

export const getCurrentUser = state => state.auth.user;
export const getUsersByUserId = state => state.users.usersByUserId;

export const getSubscriberOrgById = state => state.subscriberOrgs.subscriberOrgById;
export const getCurrentSubscriberOrgId = state => state.subscriberOrgs.currentSubscriberOrgId;

export const getSubscriberByUserId = state => state.subscribers.subscriberByUserId;
export const getSubscriberUserIdByUserId = state => state.subscribers.subscriberUserIdByUserId;
export const getUserIdsBySubscriberOrgId = state => state.subscribers.userIdsBySubscriberOrgId;

export const getTeamById = state => state.teams.teamById;
export const getTeamIdsBySubscriberOrgId = state => state.teams.teamIdsBySubscriberOrgId;

export const getTeamMemberByUserId = state => state.teamMembers.teamMemberByUserId;
export const getTeamMemberIdByUserId = state => state.teamMembers.teamMemberIdByUserId;
export const getUserIdsByTeamId = state => state.teamMembers.userIdsByTeamId;

export const getTeamRoomById = state => state.teamRooms.teamRoomById;
export const getTeamRoomIdsByTeamId = state => state.teamRooms.teamRoomIdsByTeamId;

export const getTeamRoomMemberByUserId = state => state.teamRoomMembers.teamRoomMemberByUserId;
export const getTeamRoomMemberIdByUserId = state => state.teamRoomMembers.teamRoomMemberIdByUserId;
export const getUserIdsByTeamRoomId = state => state.teamRoomMembers.userIdsByTeamRoomId;

export const getInvitations = state => state.invitations.invitations;

export const getConversationById = state => state.conversations.conversationById;
export const getConversationIdsByTeamRoomId = state => state.conversations.conversationIdsByTeamRoomId;
export const geTranscriptByConversationId = state => state.conversations.transcriptByConversationId;

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

export const getSubscriberOrgsSortedAlphabetically = createSelector(
  [getSubscriberOrgById],
  (subscriberOrgById) => {
    const subscriberOrgsSorted = Object.values(subscriberOrgById).sort(sortByName);
    return subscriberOrgsSorted;
  }
);

export const getCurrentSubscriberOrg = createSelector(
  [getCurrentSubscriberOrgId, getSubscriberOrgById],
  (currentSubscriberOrgId, subscriberOrgById) => {
    return (currentSubscriberOrgId) ? subscriberOrgById[currentSubscriberOrgId] : null;
  }
);

export const getSubscribersOfSubscriberOrgId = createCachedSelector(
  [getUserIdsBySubscriberOrgId, getUsersByUserId, (state, subscriberOrgId) => subscriberOrgId],
  (userIdsBySubscriberOrgId, usersByUserId, subscriberOrgId) => {
    if ((!subscriberOrgId) || (!userIdsBySubscriberOrgId[subscriberOrgId])) {
      return [];
    }

    const userIds = userIdsBySubscriberOrgId[subscriberOrgId];
    return userIds.map(userId => usersByUserId[userId]);
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
    return userIds.map(userId => usersByUserId[userId]);
  }
)(
  (state, teamId) => teamId
);


/**
 * Return user details, as well as orgs, teams, and team rooms.
 * This is "deep" details, where orgs, teams, and team rooms are realized.
 * Note that this information needs to be in redux.  Refer to actions fetchSubscriberOrgs, fetchTeams, and
 * fetchTeamRooms.
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

export const getTeams = createSelector(
  [getTeamById],
  (teamById) => {
    return Object.values(teamById);
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

export const getTeamsOfSubscriberOrgIdSortedAlphabetically = createCachedSelector(
  [getTeamIdsBySubscriberOrgId, getTeamById, (state, subscriberOrgId) => subscriberOrgId],
  (teamIdsBySubscriberOrgId, teamById, subscriberOrgId) => {
    if ((!subscriberOrgId) || (!teamIdsBySubscriberOrgId[subscriberOrgId])) {
      return []; // TODO: null (to differentiate from valid data).  Also, elsewhere.
    }

    const teamIds = teamIdsBySubscriberOrgId[subscriberOrgId];

    let teams = teamIds.map(teamId => teamById[teamId]);
    teams = primaryAtTop(teams.sort(sortByName));
    return teams;
  }
)(
  (state, subscriberOrgId) => subscriberOrgId
);

export const getTeamMembersOfTeamId = createCachedSelector(
  [getUserIdsByTeamId, getUsersByUserId, (state, teamId) => teamId],
  (userIdsByTeamId, usersByUserId, teamId) => {
    if ((!teamId) || (!userIdsByTeamId[teamId])) {
      return [];
    }

    const userIds = userIdsByTeamId[teamId];
    return userIds.map(userId => usersByUserId[userId]);
  }
)(
  (state, teamId) => teamId
);


export const getTeamRooms = createSelector(
  [getTeamRoomById],
  (teamRoomById) => {
    return Object.values(teamRoomById);
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


export const getTeamRoomsOfTeamIdSortedAlphabetically = createCachedSelector(
  [getTeamRoomIdsByTeamId, getTeamRoomById, (state, teamId) => teamId],
  (teamRoomIdsByTeamId, teamRoomById, teamId) => {
    if ((!teamId) || (!teamRoomIdsByTeamId[teamId])) {
      return [];
    }

    const teamRoomIds = teamRoomIdsByTeamId[teamId];

    let teamRooms = teamRoomIds.map(teamRoomId => teamRoomById[teamRoomId]);
    teamRooms.sort(sortByName); // sorted
    teamRooms = primaryAtTop(teamRooms);
    return teamRooms;
  }
)(
  (state, teamId) => teamId
);

export const getTeamRoomMembersOfTeamRoomId = createCachedSelector(
  [getUserIdsByTeamRoomId, getUsersByUserId, (state, teamRoomId) => teamRoomId],
  (userIdsByTeamRoomId, usersByUserId, teamRoomId) => {
    if ((!teamRoomId) || (!userIdsByTeamRoomId[teamRoomId])) {
      return [];
    }

    const userIds = userIdsByTeamRoomId[teamRoomId];
    return userIds.map(userId => usersByUserId[userId]);
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
  [getConversationIdsByTeamRoomId, getConversationById, geTranscriptByConversationId, (state, teamRoomId) => teamRoomId],
  (conversationIdsByTeamRoomId, conversationById, transcriptByConversationId, teamRoomId) => {
    const conversationIds = conversationIdsByTeamRoomId[teamRoomId];
    if ((!conversationIds) || (conversationIds.length === 0)) {
      return null;
    }

    // Only 1 conversation per team room, currently.
    const conversation = conversationById[conversationIds[0]];
    const transcript = transcriptByConversationId[conversationIds[0]];

    if (!conversation) {
      return null;
    }

    const conversationClone = _.cloneDeep(conversation);
    if (!transcript) {
      conversationClone.transcript = [];
      return conversationClone;
    }

    conversationClone.transcript = merge(transcript.flattenedTree, transcript.messages);
    return conversationClone;
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
