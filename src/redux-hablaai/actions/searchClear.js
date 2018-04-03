export const SEARCH_CLEAR = 'search/clear';

export const clearSearch = () => {
  return ((dispatch) => {
    dispatch({ type: SEARCH_CLEAR });
  });
};
