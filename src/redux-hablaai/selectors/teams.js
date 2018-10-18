import { createSelector } from 'reselect';
import { sortByName, primaryAtTop } from './helpers';

export const getTeamsById = state => state.teams.byId;
export const getTeamIds = state => state.teams.allIds;
export const getTeamIdsByOrg = state => state.teams.idsByOrg;

export const getTeams = createSelector([getTeamsById], teams => Object.values(teams));

export const getOrgTeams = createSelector(
  [getTeamIdsByOrg, getTeamsById, (state, orgId) => orgId],
  (teamIdsByOrg, teamsById, orgId) => {
    if (!orgId || !teamIdsByOrg[orgId]) return [];

    const teamIds = teamIdsByOrg[orgId];
    const teams = teamIds.map(teamId => teamsById[teamId]);
    return primaryAtTop(teams.sort(sortByName));
  }
);

export const getTeam = createSelector(
  [getTeamsById, (state, teamId) => teamId],
  (teamsById, teamId) => teamsById[teamId]
);
