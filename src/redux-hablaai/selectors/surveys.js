import moment from 'moment';
import { last } from 'lodash';

const SURVEYS_ENABLED = false;
const SURVEY_FREQUENCY = 30;

export const getSurveys = state => state.surveys;
export const isSubmittingSurvey = state => state.surveys.isSubmitting;
export const isFirstSurvey = state => (state.surveys.dates ? state.surveys.dates.length === 0 : null);

const isRecurrentSurveyTime = state => {
  const { dates } = state.surveys;
  const lastSurvey = last(dates.sort((a, b) => moment(a).isAfter(b)));
  const difference = moment().diff(moment(lastSurvey), 'days');
  return difference >= SURVEY_FREQUENCY;
};

export const isSurveyVisible = state =>
  SURVEYS_ENABLED &&
  state.surveys.loaded &&
  !state.surveys.error &&
  (isFirstSurvey(state) || isRecurrentSurveyTime(state));
