export const SEARCH_CLEAR = 'search/clear';

export const clearSearch = () => dispatch => {
  dispatch({ type: SEARCH_CLEAR });
};

export const GLOBAL_SEARCH_CLEAR = 'search/global/clear';

export const clearGlobalSearch = () => dispatch => {
  dispatch({ type: GLOBAL_SEARCH_CLEAR });
};
