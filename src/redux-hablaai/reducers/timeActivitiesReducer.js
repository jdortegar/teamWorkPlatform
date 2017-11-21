import { TIMEACTIVITIES_FETCH_SUCCESS } from '../actions';

const INITIAL_STATE = {
  fileTypes: [],
  files: []
};

const timeActivitiesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TIMEACTIVITIES_FETCH_SUCCESS:
      return {
        ...state,
        ...action.payload.message
      };
    default:
      return state;
  }
};

export default timeActivitiesReducer;
