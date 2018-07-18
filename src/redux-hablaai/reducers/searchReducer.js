import { getOwnersFromFiles, getFileTypesFromFiles, getIntegrationsFromFiles } from 'lib/files';

import { SEARCH_REQUEST, SEARCH_SUCCESS, SEARCH_FAILURE, SEARCH_CLEAR, SEARCH_STALE } from '../actions';

const INITIAL_STATE = {
  loading: false,
  query: '',
  results: [],
  resultsCount: 0,
  owners: [],
  fileTypes: [],
  integrations: []
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
        resultsCount: INITIAL_STATE.resultsCount
      };
    case SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        results: action.payload.files,
        resultsCount: action.payload.files.length,
        owners: getOwnersFromFiles(action.payload.files),
        fileTypes: getFileTypesFromFiles(action.payload.files),
        integrations: getIntegrationsFromFiles(action.payload.files)
      };
    case SEARCH_FAILURE:
      return {
        ...INITIAL_STATE,
        query: action.payload.query
      };
    case SEARCH_STALE:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
};

export default searchReducer;
