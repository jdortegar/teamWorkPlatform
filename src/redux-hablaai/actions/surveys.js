import { buildApiUrl } from 'src/lib/api';
import { getCurrentSubscriberOrgId, getCurrentUserId } from 'src/selectors';
import surveyQuestions from 'src/lib/surveyQuestions';
import { doAuthenticatedRequest } from './urlRequest';

export const SURVEYS_FETCH_REQUEST = 'surveys/fetch/request';
export const SURVEYS_FETCH_SUCCESS = 'surveys/fetch/success';
export const SURVEYS_FETCH_FAILURE = 'surveys/fetch/failure';
export const SURVEY_ANSWERS_FETCH_REQUEST = 'surveyAnswers/fetch/request';
export const SURVEY_ANSWERS_FETCH_SUCCESS = 'surveyAnswers/fetch/success';
export const SURVEY_ANSWERS_FETCH_FAILURE = 'surveyAnswers/fetch/failure';
export const SURVEY_CREATE_REQUEST = 'surveys/create/request';
export const SURVEY_CREATE_SUCCESS = 'surveys/create/success';
export const SURVEY_CREATE_FAILURE = 'surveys/create/failure';
export const SURVEY_UPDATE_SUCCESS = 'surveys/update/success';
export const SUBMIT_SURVEY_REQUEST = 'surveys/submit/request';
export const SUBMIT_SURVEY_SUCCESS = 'surveys/submit/success';
export const SUBMIT_SURVEY_FAILURE = 'surveys/submit/failure';
export const SURVEY_LAST_ANSWER_SUCCESS = 'surveys/lastAnswer/success';

export const fetchSurveys = () => (dispatch, getState) => {
  const orgId = getCurrentSubscriberOrgId(getState());
  const requestUrl = buildApiUrl(`organizations/${orgId}/surveys`, 'v2');

  dispatch({ type: SURVEYS_FETCH_REQUEST });

  const thunk = dispatch(
    doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    })
  );

  thunk
    .then(response =>
      dispatch({
        type: SURVEYS_FETCH_SUCCESS,
        payload: { surveys: response.data }
      })
    )
    .catch(() => dispatch({ type: SURVEYS_FETCH_FAILURE }));

  return thunk;
};

export const createSurvey = ({ startDate, endDate }) => (dispatch, getState) => {
  const orgId = getCurrentSubscriberOrgId(getState());
  const requestUrl = buildApiUrl(`organizations/${orgId}/surveys`, 'v2');

  dispatch({ type: SURVEY_CREATE_REQUEST });

  const thunk = dispatch(
    doAuthenticatedRequest({
      requestUrl,
      method: 'post',
      data: { name: 'Productivity Index Survey', questions: surveyQuestions, startDate, endDate }
    })
  );

  thunk
    .then(response => dispatch({ type: SURVEY_CREATE_SUCCESS, payload: response.data }))
    .catch(() => dispatch({ type: SURVEY_CREATE_FAILURE }));

  return thunk;
};

export const updateSurvey = (surveyId, { startDate, endDate }) => (dispatch, getState) => {
  const orgId = getCurrentSubscriberOrgId(getState());
  const requestUrl = buildApiUrl(`organizations/${orgId}/surveys/${surveyId}`, 'v2');

  dispatch({ type: SURVEY_CREATE_REQUEST });

  const thunk = dispatch(
    doAuthenticatedRequest({
      requestUrl,
      method: 'patch',
      data: { startDate, endDate }
    })
  );

  thunk
    .then(response => dispatch({ type: SURVEY_UPDATE_SUCCESS, payload: { survey: response.data } }))
    .catch(() => dispatch({ type: SURVEY_CREATE_FAILURE }));

  return thunk;
};

export const submitSurvey = (surveyId, answers) => (dispatch, getState) => {
  const state = getState();
  const orgId = getCurrentSubscriberOrgId(state);
  const userId = getCurrentUserId(state);
  const requestUrl = buildApiUrl(`organizations/${orgId}/surveys/${surveyId}/answers`, 'v2');

  dispatch({ type: SUBMIT_SURVEY_REQUEST });

  const thunk = dispatch(
    doAuthenticatedRequest({
      requestUrl,
      method: 'post',
      data: { userId, answers }
    })
  );

  thunk.then(() => dispatch({ type: SUBMIT_SURVEY_SUCCESS })).catch(() => dispatch({ type: SUBMIT_SURVEY_FAILURE }));
  return thunk;
};

export const fetchLastAnswerDate = surveyId => (dispatch, getState) => {
  const orgId = getCurrentSubscriberOrgId(getState());
  const userId = getCurrentUserId(getState());
  const requestUrl = buildApiUrl(`organizations/${orgId}/users/${userId}/surveys/${surveyId}/date`, 'v2');

  const thunk = dispatch(
    doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    })
  );

  thunk.then(response =>
    dispatch({
      type: SURVEY_LAST_ANSWER_SUCCESS,
      payload: response.data
    })
  );

  return thunk;
};

export const fetchSurveyAnswers = () => (dispatch, getState) => {
  const orgId = getCurrentSubscriberOrgId(getState());
  const requestUrl = buildApiUrl(`organizations/${orgId}/surveys/answers`, 'v2');

  dispatch({ type: SURVEY_ANSWERS_FETCH_REQUEST });

  const thunk = dispatch(
    doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    })
  );

  thunk
    .then(response =>
      dispatch({
        type: SURVEY_ANSWERS_FETCH_SUCCESS,
        payload: { surveyAnswers: response.data }
      })
    )
    .catch(() => dispatch({ type: SURVEY_ANSWERS_FETCH_FAILURE }));

  return thunk;
};
