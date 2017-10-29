import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import {
  getTeamById,
  getTeamIdsBySubscriberOrgId
} from './state';
import {
  sortByName,
  primaryAtTop
} from './helpers';

export {
  getTeamById,
  getTeamIdsBySubscriberOrgId
} from './state';

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
