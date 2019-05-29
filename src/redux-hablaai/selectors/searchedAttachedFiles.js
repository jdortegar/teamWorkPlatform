import { createSelector } from 'reselect';

import { getUserById } from './users';

export const getSearchedAttachedFiles = state => state.searchedAttachedFiles.items;
export const getSearchedAttachedFilesOwners = state => state.searchedAttachedFiles.owners;
export const getSearchedAttachedFileTypes = state => state.searchedAttachedFiles.fileTypes;
export const getSearchedAttachedExcludeFilters = state => state.searchedAttachedFiles.excludeFilters;

export const getAttachedFilesOwners = createSelector(
  [getSearchedAttachedFilesOwners, state => state],
  (owners, state) => owners.map(({ key, count }) => ({ ...getUserById(state, key), key, count }))
);
