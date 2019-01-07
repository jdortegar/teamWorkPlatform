import { createSelector } from 'reselect';
import { sortByName, primaryAtTop } from './helpers';
import { getCurrentSubscriberOrgId } from './state';

export const getTeamsById = state => state.teams.byId;
export const getTeamIds = state => state.teams.allIds;
export const getTeamIdsByOrg = state => state.teams.idsByOrg;

export const getTeams = createSelector(
  [getTeamsById],
  teams => Object.values(teams)
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
  getActiveTeams,
  activeTeams => activeTeams.find(team => team.primary)
);
