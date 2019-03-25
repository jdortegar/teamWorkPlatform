import { createSelector } from 'reselect';

import { getUserById } from './users';

export const getFiles = state => state.files.items;
export const getTeamLoading = state => state.files.teamLoading;
export const getFilesOwners = state => state.files.owners;
export const getFileIntegrations = state => state.files.integrations;
export const getFileTypes = state => state.files.fileTypes;
export const getExcludeFilters = state => state.files.excludeFilters;

export const getOwners = createSelector(
  [getFilesOwners, state => state],
  (owners, state) => owners.map(({ key, count }) => ({ ...getUserById(state, key), key, count }))
);

export const getTeamFilesLoading = createSelector(
  [getTeamLoading, (state, teamId) => teamId],
  (teams = {}, teamId) => teams[teamId] || false
);
