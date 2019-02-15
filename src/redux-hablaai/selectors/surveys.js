import moment from 'moment';
import { createSelector } from 'reselect';
import { last } from 'lodash';

const SURVEYS_ENABLED = false;
const LAST_SURVEY_TIMEOUT = 7;

export const getSurveys = state => state.surveys.surveys;
export const isFetchingSurveys = state => state.surveys.isFetching;
export const isCreatingSurvey = state => state.surveys.isCreating;
export const isSubmittingSurvey = state => state.surveys.isSubmitting;
export const surveyHasError = state => state.surveys.error;

// TODO: get active survey by date
export const getActiveSurvey = createSelector(
  getSurveys,
  surveys => surveys.find(survey => survey.id === '50a5b5e8-1ec6-427b-b4e0-e701579c7906')
);

// TODO: get last survey by date
export const getLastSurvey = createSelector(
  getSurveys,
  surveys => last(surveys)
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
