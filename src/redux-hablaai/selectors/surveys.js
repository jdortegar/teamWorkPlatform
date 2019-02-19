import moment from 'moment';
import { createSelector } from 'reselect';
import { sortBy, last } from 'lodash';

const SURVEYS_ENABLED = true;
const LAST_SURVEY_TIMEOUT = 7;

export const getSurveys = state => state.surveys.surveys;
export const getLastAnswerDate = state => state.surveys.lastAnswerDate;
export const isLastAnswerLoaded = state => state.surveys.lastAnswerLoaded;
export const isFetchingSurveys = state => state.surveys.isFetching;
export const isCreatingSurvey = state => state.surveys.isCreating;
export const isSubmittingSurvey = state => state.surveys.isSubmitting;
export const surveyHasError = state => state.surveys.error;

// return active survey (already started but not finished). This survey can be answered by users
export const getActiveSurvey = createSelector(
  getSurveys,
  (surveys = []) => {
    const survey = last(sortBy(surveys, 'startDate'));
    if (survey && moment().isBetween(survey.startDate, moment(survey.endDate).add(LAST_SURVEY_TIMEOUT, 'days'))) {
      return survey;
    }
    return null;
  }
);

// return latest unfinished survey (and possibly not started). Admin can still update it if it hasn't started yet
export const getLastSurvey = createSelector(
  getSurveys,
  (surveys = []) => {
    const survey = last(sortBy(surveys, 'startDate'));
    if (survey && moment() < moment(survey.endDate).add(LAST_SURVEY_TIMEOUT, 'days')) {
      return survey;
    }
    return null;
  }
);

// true if we're between start and end dates and the survey hasn't been answered yet
const isFirstSurveyTime = createSelector(
  [getActiveSurvey, getLastAnswerDate],
  (survey, lastAnswerDate) =>
    survey && !moment(lastAnswerDate).isValid() && moment().isBetween(survey.startDate, survey.endDate)
);

// true if we're between the end date and the timeout period, and the first part was answered before the end date
const isLastSurveyTime = createSelector(
  [getActiveSurvey, getLastAnswerDate],
  (survey, lastAnswerDate) =>
    survey &&
    moment(lastAnswerDate).isBefore(survey.endDate) &&
    moment().isBetween(survey.endDate, moment(survey.endDate).add(LAST_SURVEY_TIMEOUT, 'days'))
);

// TODO: check if the questions will be different in the first and last survey time
export const getSurveyType = state => {
  if (isFirstSurveyTime(state)) return 'first';
  if (isLastSurveyTime(state)) return 'last';
  return null;
};

export const isSurveyVisible = state => SURVEYS_ENABLED && isLastAnswerLoaded(state) && getSurveyType(state) !== null;
