import moment from 'moment';
import { createSelector } from 'reselect';
import { isEmpty, sortBy, join, reduce, reverse, flatten, last, uniq, size, parseInt } from 'lodash';

import { getUserByUserId } from './users';

const SURVEYS_ENABLED = true; // quickly disable surveys
const TIMEOUT = 7; // time in days that the users are allowed to answer the survey

export const getSurveys = state => state.surveys.surveys;
export const getSurveyAnswers = state => state.surveys.surveyAnswers;
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
    if (survey && moment().isBetween(survey.startDate, moment(survey.endDate).add(TIMEOUT, 'days'))) {
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
    if (survey && moment() < moment(survey.endDate).add(TIMEOUT, 'days')) {
      return survey;
    }
    return null;
  }
);

// true if we're between [start] and [start + timeout] dates and the survey hasn't been answered yet
const isFirstSurveyTime = createSelector(
  [getActiveSurvey, getLastAnswerDate],
  (survey, lastAnswerDate) =>
    survey &&
    !moment(lastAnswerDate).isValid() &&
    moment().isBetween(survey.startDate, moment(survey.startDate).add(TIMEOUT, 'days'))
);

// true if we're between the [end] and [end + timeout] period, and the first part was answered
const isLastSurveyTime = createSelector(
  [getActiveSurvey, getLastAnswerDate],
  (survey, lastAnswerDate) =>
    survey &&
    moment(lastAnswerDate).isBefore(survey.endDate) &&
    moment().isBetween(survey.endDate, moment(survey.endDate).add(TIMEOUT, 'days'))
);

export const getSurveyType = state => {
  if (isFirstSurveyTime(state)) return 'first';
  if (isLastSurveyTime(state)) return 'last';
  return null;
};

export const isSurveyVisible = state => SURVEYS_ENABLED && isLastAnswerLoaded(state) && getSurveyType(state) !== null;

export const getSurveyReport = createSelector(
  [getSurveyAnswers, getUserByUserId],
  (surveyAnswers, users) => {
    const buildReport = answers => {
      const filterByQuestion = question => answers.filter(a => a.question === question);
      const userIds = uniq(answers.map(a => a.userId));
      const hoursSpentAnswers = filterByQuestion('hours-spent');
      const toolsAnswers = filterByQuestion('tools');
      const preferenceAnswers = filterByQuestion('preference');

      const flattenAnswers = items => sortBy(flatten(items.map(i => i.answer)));
      const countAnswers = items =>
        flattenAnswers(items).reduce(
          (acc, item) => ({
            ...acc,
            [item]: { name: item, count: acc[item] ? acc[item].count + 1 : 1 }
          }),
          {}
        );
      const sortAnswers = items => sortBy(countAnswers(items), 'count');
      const findMainAnswer = items => (last(sortAnswers(items)) || {}).name;
      const findUser = userId => users[userId];

      return {
        numberOfAnswers: {
          mainAnswer: size(userIds),
          answers: userIds.map(userId => ({ user: findUser(userId) }))
        },
        hoursSpent: {
          mainAnswer: hoursSpentAnswers.reduce((acc, a) => acc + parseInt(a.answer), 0),
          answers: hoursSpentAnswers.map(a => ({
            user: findUser(a.userId),
            answer: [join(a.answer, '')]
          }))
        },
        tools: {
          mainAnswer: findMainAnswer(toolsAnswers),
          summary: reduce(reverse(sortAnswers(toolsAnswers)), (acc, item) => ({ ...acc, [item.name]: item.count }), {}),
          answers: toolsAnswers.map(a => ({
            user: findUser(a.userId),
            answer: a.answer
          }))
        },
        preference: {
          mainAnswer: findMainAnswer(preferenceAnswers),
          answers: preferenceAnswers.map(a => ({
            user: findUser(a.userId),
            answer: a.answer
          }))
        }
      };
    };

    return surveyAnswers.reduce((result, survey) => {
      const { questions: answers } = survey;
      const filterDates = (start, end) => answers.filter(a => moment(a.date).isBetween(start, end));

      const firstAnswers = filterDates(survey.startDate, moment(survey.startDate).add(TIMEOUT, 'days'));
      const lastAnswers = filterDates(survey.endDate, moment(survey.endDate).add(TIMEOUT, 'days'));
      const firstReport = isEmpty(firstAnswers) ? {} : { [survey.startDate]: buildReport(firstAnswers) };
      const lastReport = isEmpty(lastAnswers) ? {} : { [survey.endDate]: buildReport(lastAnswers) };

      return {
        ...result,
        ...firstReport,
        ...lastReport
      };
    }, {});
  }
);
