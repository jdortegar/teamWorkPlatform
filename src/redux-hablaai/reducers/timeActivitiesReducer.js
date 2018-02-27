import _ from 'lodash';
import { TIMEACTIVITIES_FETCH_SUCCESS } from '../actions';
import String from '../../translations';

const INITIAL_STATE = {
  fileTypes: [],
  files: [],
  edges: []
};

function getUniqueFileTypes(files) {
  const other = String.t('ckgPage.filterTypeOther');
  const foundLabels = {};
  const filteredFiles = files.filter(({ fileType, fileExtension }) => {
    const label = fileExtension || other;
    const count = foundLabels[label] ? foundLabels[label].count : 0;
    foundLabels[label] = {
      key: label,
      label: fileType || label,
      fileExtension,
      count: count + 1
    };
    return count === 0;
  });

  const labels = Object.keys(foundLabels).sort((a, b) => {
    const countA = foundLabels[a].count;
    const countB = foundLabels[b].count;
    if (countA === countB) return 0;
    return (countA < countB) ? 1 : -1;
  }).map((label) => {
    return foundLabels[label];
  });

  return { files: filteredFiles, labels };
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
