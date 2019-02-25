import moment from 'moment';
import {
  SURVEYS_FETCH_REQUEST,
  SURVEYS_FETCH_SUCCESS,
  SURVEYS_FETCH_FAILURE,
  SURVEY_ANSWERS_FETCH_REQUEST,
  SURVEY_ANSWERS_FETCH_SUCCESS,
  SURVEY_ANSWERS_FETCH_FAILURE,
  SURVEY_CREATE_REQUEST,
  SURVEY_CREATE_SUCCESS,
  SURVEY_CREATE_FAILURE,
  SURVEY_UPDATE_SUCCESS,
  SUBMIT_SURVEY_REQUEST,
  SUBMIT_SURVEY_SUCCESS,
  SUBMIT_SURVEY_FAILURE,
  SURVEY_LAST_ANSWER_SUCCESS
} from 'src/actions';

const INITIAL_STATE = {
  surveys: [],
  surveyAnswers: [],
  lastAnswerLoaded: false,
  lastAnswerDate: null,
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
    case SURVEY_ANSWERS_FETCH_REQUEST:
      return { ...state, isFetching: true };
    case SURVEY_ANSWERS_FETCH_SUCCESS:
      return { ...state, isFetching: false, surveyAnswers: action.payload.surveyAnswers };
    case SURVEY_ANSWERS_FETCH_FAILURE:
      return { ...state, isFetching: false };
    case SURVEY_CREATE_REQUEST:
      return { ...state, isCreating: true };
    case SURVEY_CREATE_SUCCESS:
      return { ...state, isCreating: false };
    case SURVEY_CREATE_FAILURE:
      return { ...state, isCreating: false };
    case SURVEY_UPDATE_SUCCESS: {
      const { survey } = action.payload;
      const surveys = state.surveys.filter(s => s.id !== survey.id);
      return { ...state, isCreating: false, surveys: [...surveys, survey] };
    }
    case SUBMIT_SURVEY_REQUEST:
      return { ...state, isSubmitting: true, error: false };
    case SUBMIT_SURVEY_SUCCESS:
      return { ...state, isSubmitting: false, error: false, lastAnswerDate: moment() };
    case SUBMIT_SURVEY_FAILURE:
      return { ...state, isSubmitting: false, error: true, lastAnswerDate: null };
    case SURVEY_LAST_ANSWER_SUCCESS:
      return { ...state, lastAnswerLoaded: true, lastAnswerDate: action.payload.lastDate };
    default:
      return state;
  }
};

export default searchReducer;
