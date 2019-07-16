import { createSelector } from 'reselect';
import { difference, sortBy } from 'lodash';
import { sortByName, primaryAtTop } from './helpers';
import { getCurrentSubscriberOrgId } from './state';

export const getTeamsById = state => state.teams.byId;
export const getTeamIds = state => state.teams.allIds;
export const getTeamIdsByOrg = state => state.teams.idsByOrg;
export const getCurrentUserTeamsById = state => state.teams.myIds;

export const getTeams = createSelector(
  [getTeamsById],
  teams => Object.values(teams)
);

export const getCurrentUserTeams = createSelector(
  [getTeamsById, getCurrentUserTeamsById],
  (teamsById, currentUserTeams) => {
    if (!currentUserTeams) return [];

    const teams = currentUserTeams.map(teamId => teamsById[teamId]);
    return primaryAtTop(teams.sort(sortByName));
  }
);

export const getOrgPublicTeams = createSelector(
  [getTeamIdsByOrg, getTeamsById, getCurrentSubscriberOrgId, getCurrentUserTeamsById],
  (teamIdsByOrg, teamsById, orgId, currentUserTeams) => {
    if (!orgId || !teamIdsByOrg[orgId]) return [];

    const teamIds = difference(teamIdsByOrg[orgId], currentUserTeams);
    if (teamIds.length === 0) return [];
    const teams = teamIds.map(teamId => {
      if (teamsById[teamId] && teamsById[teamId].preferences.public) {
        return teamsById[teamId];
      }
      return false;
    });
    return primaryAtTop(teams.filter(Boolean).sort(sortByName));
  }
);

export const getOrgTeams = createSelector(
  [getTeamIdsByOrg, getTeamsById, getCurrentSubscriberOrgId],
  (teamIdsByOrg, teamsById, orgId) => {
    if (!orgId || !teamIdsByOrg[orgId]) return [];

    const teamIds = teamIdsByOrg[orgId];
    const teams = teamIds.map(teamId => teamsById[teamId]);
    return primaryAtTop(teams.sort(sortByName));
  }
);

export const getActiveTeams = createSelector(
  [getTeamIdsByOrg, getTeamsById, getCurrentSubscriberOrgId],
  (teamIdsByOrg, teamsById, orgId) => {
    if (!orgId || !teamIdsByOrg[orgId]) return [];

    const teamIds = teamIdsByOrg[orgId];
    const teams = teamIds.map(teamId => teamsById[teamId]).filter(team => team.active);
    return primaryAtTop(teams.sort(sortByName));
  }
);

export const getTeam = createSelector(
  [getTeamsById, (state, teamId) => teamId],
  (teamsById, teamId) => teamsById[teamId]
);

export const getPrimaryTeam = createSelector(
  getCurrentUserTeams,
  activeTeams => activeTeams.find(team => team.primary)
);

export const getFirstTeam = createSelector(
  getCurrentUserTeams,
  activeTeams => {
    const teamSorted = sortBy(activeTeams, 'created');
    return teamSorted[0];
  }
);
