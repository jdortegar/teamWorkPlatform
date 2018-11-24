import { uniqBy } from 'lodash';
import { getOwnersFromFiles, getFileTypesFromFiles, getIntegrationsFromFiles } from 'src/lib/files';

import {
  SEARCH_SUCCESS,
  TIMEACTIVITIES_FETCH_SUCCESS,
  TOGGLE_OWNER_FILTER,
  TOGGLE_INTEGRATION_FILTER,
  TOGGLE_FILETYPE_FILTER,
  SUBSCRIBERORG_SETCURRENT
} from 'src/actions';

const INITIAL_STATE = {
  items: [],
  owners: [],
  fileTypes: [],
  integrations: [],
  excludeFilters: {
    owners: {},
    fileTypes: {},
    integrations: {}
  }
};

const filesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEARCH_SUCCESS:
    case TIMEACTIVITIES_FETCH_SUCCESS:
      return {
        ...state,
        items: uniqBy(action.payload.files, 'fileId'),
        owners: getOwnersFromFiles(action.payload.files),
        fileTypes: getFileTypesFromFiles(action.payload.files),
        integrations: getIntegrationsFromFiles(action.payload.files)
      };
    case TOGGLE_OWNER_FILTER: {
      const { key } = action.payload;
      return {
        ...state,
        excludeFilters: {
          ...state.excludeFilters,
          owners: {
            ...state.excludeFilters.owners,
            [key]: state.excludeFilters.owners[key] ? null : true
          }
        }
      };
    }
    case TOGGLE_INTEGRATION_FILTER: {
      const { key } = action.payload;
      return {
        ...state,
        excludeFilters: {
          ...state.excludeFilters,
          integrations: {
            ...state.excludeFilters.integrations,
            [key]: state.excludeFilters.integrations[key] ? null : true
          }
        }
      };
    }
    case TOGGLE_FILETYPE_FILTER: {
      const { key } = action.payload;
      return {
        ...state,
        excludeFilters: {
          ...state.excludeFilters,
          fileTypes: {
            ...state.excludeFilters.fileTypes,
            [key]: state.excludeFilters.fileTypes[key] ? null : true
          }
        }
      };
    }
    case SUBSCRIBERORG_SETCURRENT:
      return {
        ...INITIAL_STATE
      };
    default:
      return state;
  }
};

export default filesReducer;
