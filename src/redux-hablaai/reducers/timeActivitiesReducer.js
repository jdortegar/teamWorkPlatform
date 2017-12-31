import _ from 'lodash';
import { TIMEACTIVITIES_FETCH_SUCCESS } from '../actions';

const INITIAL_STATE = {
  fileTypes: [],
  files: [],
  edges: []
};

const timeActivitiesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TIMEACTIVITIES_FETCH_SUCCESS:
      return {
        ...state,
        files: _.uniqBy(action.payload.files, 'fileId'),
        edges: action.payload.edges
      };
    default:
      return state;
  }
};

export default timeActivitiesReducer;
