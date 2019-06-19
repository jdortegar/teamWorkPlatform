import { createSelector } from 'reselect';

import { getUserById } from './users';

export const getSearchedFiles = state => state.searchedFiles.items;
export const getSearchedFilesOwners = state => state.searchedFiles.owners;
export const getSearchedFileTypes = state => state.searchedFiles.fileTypes;
export const getSearchedExcludeFilters = state => state.searchedFiles.excludeFilters;

export const getAllFilesOwners = createSelector(
  [getSearchedFilesOwners, state => state],
  (owners, state) => owners.map(({ key, count }) => ({ ...getUserById(state, key), key, count }))
);
