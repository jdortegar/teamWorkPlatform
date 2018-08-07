export const SEARCH_CLEAR = 'search/clear';

export const clearSearch = () => dispatch => {
  dispatch({ type: SEARCH_CLEAR });
};
