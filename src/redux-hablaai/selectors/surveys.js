export const getSurveys = state => state.surveys;
export const isSubmittingSurvey = state => state.surveys.isSubmitting;
export const isSurveyVisible = state => state.surveys.loaded && !state.surveys.error && !state.surveys.dates[0];
