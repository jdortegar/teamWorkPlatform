import _ from 'lodash';
import {
  getFileTypesFromFiles,
  getIntegrationsFromFiles
} from 'lib/files';

import { TIMEACTIVITIES_FETCH_SUCCESS } from '../actions';

const INITIAL_STATE = {
  files: [],
  fileTypes: [],
  integrations: [],
  edges: []
};

const timeActivitiesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TIMEACTIVITIES_FETCH_SUCCESS:
      return {
        ...state,
        files: _.uniqBy(action.payload.files, 'fileId'),
        fileTypes: getFileTypesFromFiles(action.payload.files),
        integrations: getIntegrationsFromFiles(action.payload.files),
        edges: action.payload.edges
      };
    default:
      return state;
  }
};

export default timeActivitiesReducer;
