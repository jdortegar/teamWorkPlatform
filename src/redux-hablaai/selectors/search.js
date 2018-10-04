export const getSearch = state => state.search;
export const getSearchQuery = state => state.search.query;
export const getSearchKeywords = state => state.search.keywords;

export const isSearchLoading = state => state.search.loading;
export const isSearchCaseSensitive = state => state.search.caseSensitive;
export const isSearchExactMatch = state => state.search.exactMatch;
