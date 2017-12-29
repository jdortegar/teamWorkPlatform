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
        files: action.payload.files,
        edges: action.payload.edges
      };
    default:
      return state;
  }
};

export default timeActivitiesReducer;
