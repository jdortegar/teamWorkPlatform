import moment from 'moment';
import { createSelector } from 'reselect';
import { sortBy, last } from 'lodash';

const SURVEYS_ENABLED = true;
const LAST_SURVEY_TIMEOUT = 7;

export const getSurveys = state => state.surveys.surveys;
export const isFetchingSurveys = state => state.surveys.isFetching;
export const isCreatingSurvey = state => state.surveys.isCreating;
export const isSubmittingSurvey = state => state.surveys.isSubmitting;
export const surveyHasError = state => state.surveys.error;

// return active survey (already started but not finished). This survey can be answered by users
export const getActiveSurvey = createSelector(
  getSurveys,
  // TODO: remove hard-coded ID
  (surveys = []) => surveys.find(survey => survey.id === '904bca3d-0d1b-4647-a5bf-55b9bda73c9c')
  /* surveys => {
    const survey = last(sortBy(surveys, 'startDate'));
    if (survey.startDate < moment() && moment() < moment(survey.endDate).add(LAST_SURVEY_TIMEOUT, 'days')) {
      return survey;
    }
    return null;
  } */
);

// return latest unfinished survey (and possibly not started). Admin can still update it if it hasn't started yet
export const getLastSurvey = createSelector(
  getSurveys,
  (surveys = []) => {
    const survey = last(sortBy(surveys, 'startDate'));
    if (moment() < moment(survey.endDate).add(LAST_SURVEY_TIMEOUT, 'days')) {
      return survey;
    }
    return null;
  }
);

const isFirstSurveyTime = createSelector(
  getActiveSurvey,
  survey => survey && survey.startDate < moment() && survey.endDate > moment()
);

const isLastSurveyTime = createSelector(
  getActiveSurvey,
  survey => survey && survey.endDate < moment() && moment() < moment(survey.endDate).add(LAST_SURVEY_TIMEOUT, 'days')
);

// TODO: check if the questions will be different in the first and last survey time
export const getSurveyType = state => {
  if (isFirstSurveyTime(state)) return 'first';
  if (isLastSurveyTime(state)) return 'last';
  return null;
};

export const isSurveyVisible = state => SURVEYS_ENABLED && getSurveyType(state) !== null;
