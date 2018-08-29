import moment from 'moment';
import { SURVEYS_FETCH_SUCCESS, SUBMIT_SURVEY_REQUEST, SUBMIT_SURVEY_SUCCESS, SUBMIT_SURVEY_FAILURE } from '../actions';

const INITIAL_STATE = {
  dates: [],
  loaded: false,
  isSubmitting: false
};

const searchReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SURVEYS_FETCH_SUCCESS:
      return { ...state, loaded: true, dates: action.payload.dates };
    case SUBMIT_SURVEY_REQUEST:
      return { ...state, isSubmitting: true };
    case SUBMIT_SURVEY_SUCCESS:
      return { ...state, isSubmitting: false, dates: [...state.dates, moment().format('YYYY-MM-DD')] };
    case SUBMIT_SURVEY_FAILURE:
      return { ...state, isSubmitting: false };
    default:
      return state;
  }
};

export default searchReducer;
