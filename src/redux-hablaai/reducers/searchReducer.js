import { SEARCH_REQUEST, SEARCH_SUCCESS, SEARCH_CLEAR } from '../actions';

const INITIAL_STATE = {
  loading: false,
  query: '',
  results: []
};

const searchReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEARCH_CLEAR:
      return {
        ...state,
        query: INITIAL_STATE.query
      };
    case SEARCH_REQUEST:
      return {
        ...state,
        loading: true,
        query: action.payload.query,
        results: []
      };
    case SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        query: action.payload.query,
        results: action.payload.results
      };
    default:
      return state;
  }
};

export default searchReducer;
