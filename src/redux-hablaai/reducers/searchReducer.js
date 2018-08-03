import { getOwnersFromFiles, getFileTypesFromFiles, getIntegrationsFromFiles } from 'lib/files';

import {
  SEARCH_REQUEST,
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
  SEARCH_CLEAR,
  SEARCH_STALE,
  TOGGLE_CASE_SENSITIVE
} from '../actions';

const INITIAL_STATE = {
  loading: false,
  query: '',
  caseSensitive: false,
  results: [],
  resultsCount: 0,
  owners: [],
  fileTypes: [],
  integrations: []
};

const searchReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEARCH_CLEAR:
      return { ...state, query: INITIAL_STATE.query };
    case SEARCH_REQUEST:
      return { ...state, loading: true, query: action.payload.query, resultsCount: INITIAL_STATE.resultsCount };
    case SEARCH_SUCCESS: {
      const { files } = action.payload;
      return {
        ...state,
        loading: false,
        results: files,
        resultsCount: files.length,
        owners: getOwnersFromFiles(files),
        fileTypes: getFileTypesFromFiles(files),
        integrations: getIntegrationsFromFiles(files)
      };
    }
    case SEARCH_FAILURE:
      return { ...INITIAL_STATE, query: action.payload.query };
    case SEARCH_STALE:
      return { ...state, loading: false };
    case TOGGLE_CASE_SENSITIVE:
      return { ...state, caseSensitive: action.payload.caseSensitive };
    default:
      return state;
  }
};

export default searchReducer;
