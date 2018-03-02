import _ from 'lodash';
import { TIMEACTIVITIES_FETCH_SUCCESS } from '../actions';
import String from '../../translations';
import { integrationKeyFromResourceUri } from '../../utils/dataIntegrations';

const INITIAL_STATE = {
  fileTypes: [],
  dataIntegrations: [],
  files: [],
  edges: []
};

function getUniqueFileTypes(files) {
  const other = String.t('ckgPage.filterTypeOther');
  const foundLabels = {};
  const dataIntegrations = {};
  const filteredFiles = files.filter(({ fileType, fileExtension, resourceUri }) => {
    const label = fileExtension || other;
    const count = foundLabels[label] ? foundLabels[label].count : 0;
    foundLabels[label] = {
      key: label,
      label: fileType || label,
      fileExtension,
      count: count + 1
    };

    const key = integrationKeyFromResourceUri(resourceUri);
    if (key) {
      dataIntegrations[key] = {
        key,
        count: 1 + (dataIntegrations[key] ? dataIntegrations[key].count : 0)
      };
    }

    return count === 0;
  });

  // sort filter types
  const labels = Object.keys(foundLabels).sort((a, b) => {
    const countA = foundLabels[a].count;
    const countB = foundLabels[b].count;
    if (countA === countB) return 0;
    return (countA < countB) ? 1 : -1;
  }).map((label) => {
    return foundLabels[label];
  });

  // sort data integrations
  const integrations = Object.keys(dataIntegrations).sort((a, b) => {
    const countA = dataIntegrations[a].count;
    const countB = dataIntegrations[b].count;
    if (countA === countB) return 0;
    return (countA < countB) ? 1 : -1;
  }).map((dataIntegration) => {
    return dataIntegrations[dataIntegration];
  });

  return { files: filteredFiles, labels, integrations };
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
