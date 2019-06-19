export const getSearch = state => state.search;
export const getSearchQuery = state => state.search.query;
export const getSearchKeywords = state => state.search.keywords;
export const getSearchTeamId = state => state.search.teamId;

export const isSearchLoading = state => state.search.loading;
export const isSearchCaseSensitive = state => state.search.caseSensitive;
export const isSearchExactMatch = state => state.search.exactMatch;
export const isSearchAll = state => state.search.allSelector;
