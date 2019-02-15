import {
  SURVEYS_FETCH_REQUEST,
  SURVEYS_FETCH_SUCCESS,
  SURVEYS_FETCH_FAILURE,
  SURVEY_CREATE_REQUEST,
  SURVEY_CREATE_SUCCESS,
  SURVEY_CREATE_FAILURE,
  SUBMIT_SURVEY_REQUEST,
  SUBMIT_SURVEY_SUCCESS,
  SUBMIT_SURVEY_FAILURE
} from 'src/actions';

const INITIAL_STATE = {
  surveys: [],
  isFetching: false,
  isCreating: false,
  isSubmitting: false,
  error: false
};

const searchReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SURVEYS_FETCH_REQUEST:
      return { ...state, isFetching: true };
    case SURVEYS_FETCH_SUCCESS:
      return { ...state, isFetching: false, surveys: action.payload.surveys };
    case SURVEYS_FETCH_FAILURE:
      return { ...state, isFetching: false };
    case SURVEY_CREATE_REQUEST:
      return { ...state, isCreating: true };
    case SURVEY_CREATE_SUCCESS:
      return { ...state, isCreating: false };
    case SURVEY_CREATE_FAILURE:
      return { ...state, isCreating: false };
    case SUBMIT_SURVEY_REQUEST:
      return { ...state, isSubmitting: true, error: false };
    case SUBMIT_SURVEY_SUCCESS:
      return { ...state, isSubmitting: false, error: false };
    case SUBMIT_SURVEY_FAILURE:
      return { ...state, isSubmitting: false, error: true };
    default:
      return state;
  }
};

export default searchReducer;
