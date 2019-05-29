import { createSelector } from 'reselect';

import { getUserById } from './users';

export const getSearchedChatMessages = state => state.searchedChatMessages.items;
export const getSearchedChatMessagesOwners = state => state.searchedChatMessages.owners;
export const getSearchedChatMessagesExcludeFilters = state => state.searchedChatMessages.excludeFilters;

export const getChatMessagesOwners = createSelector(
  [getSearchedChatMessagesOwners, state => state],
  (owners, state) => owners.map(({ key, count }) => ({ ...getUserById(state, key), key, count }))
);
