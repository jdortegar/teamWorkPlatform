import {
  SEARCH_REQUEST,
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
  SEARCH_CLEAR,
  SEARCH_STALE,
  TOGGLE_CASE_SENSITIVE,
  TOGGLE_AND_OPERATOR,
  SUBSCRIBERORG_SETCURRENT
} from '../actions';

const INITIAL_STATE = {
  loading: false,
  query: '',
  keywords: [],
  caseSensitive: false,
  andOperator: false,
  resultsCount: 0
};

const searchReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEARCH_CLEAR:
      return { ...state, query: INITIAL_STATE.query };
    case SEARCH_REQUEST:
      return {
        ...state,
        loading: true,
        query: action.payload.query,
        keywords: action.payload.keywords,
        resultsCount: INITIAL_STATE.resultsCount
      };
    case SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        resultsCount: action.payload.files.length
      };
    case SEARCH_FAILURE:
      return {
        ...INITIAL_STATE,
        loading: false,
        query: action.payload.query,
        keywords: action.payload.keywords
      };
    case SEARCH_STALE:
      return { ...state, loading: false };
    case TOGGLE_CASE_SENSITIVE:
      return { ...state, caseSensitive: action.payload.caseSensitive };
    case TOGGLE_AND_OPERATOR:
      return { ...state, andOperator: action.payload.andOperator };
    case SUBSCRIBERORG_SETCURRENT:
      return { ...INITIAL_STATE };
    default:
      return state;
  }
};

export default searchReducer;
