import _ from 'lodash';
import { TIMEACTIVITIES_FETCH_SUCCESS } from '../actions';
import String from '../../translations';

const INITIAL_STATE = {
  fileTypes: [],
  files: [],
  edges: []
};

function getUniqueFileTypes(files) {
  const foundLabels = {};
  const other = String.t('ckgPage.filterTypeOther');
  return files.filter((file) => {
    const label = file.fileType || other;
    const found = foundLabels[label];
    if (!found) {
      foundLabels[label] = true;
    }
    return !found;
  });
}

const timeActivitiesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TIMEACTIVITIES_FETCH_SUCCESS:
      return {
        ...state,
        files: _.uniqBy(action.payload.files, 'fileId'),
        fileTypes: getUniqueFileTypes(action.payload.files),
        edges: action.payload.edges
      };
    default:
      return state;
  }
};

export default timeActivitiesReducer;
