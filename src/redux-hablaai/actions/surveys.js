import { buildApiUrl } from 'src/lib/api';
import { getCurrentSubscriberOrgId } from 'src/selectors';
import surveyQuestions from 'src/lib/surveyQuestions';
import { doAuthenticatedRequest } from './urlRequest';

export const SURVEYS_FETCH_REQUEST = 'surveys/fetch/request';
export const SURVEYS_FETCH_SUCCESS = 'surveys/fetch/success';
export const SURVEYS_FETCH_FAILURE = 'surveys/fetch/failure';
export const SURVEY_CREATE_REQUEST = 'surveys/create/request';
export const SURVEY_CREATE_SUCCESS = 'surveys/create/success';
export const SURVEY_CREATE_FAILURE = 'surveys/create/failure';
export const SUBMIT_SURVEY_REQUEST = 'surveys/submit/request';
export const SUBMIT_SURVEY_SUCCESS = 'surveys/submit/success';
export const SUBMIT_SURVEY_FAILURE = 'surveys/submit/failure';

export const fetchSurveys = () => dispatch => {
  const requestUrl = buildApiUrl('surveys', 'v2');

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
  const requestUrl = buildApiUrl('surveys', 'v2');
  const orgId = getCurrentSubscriberOrgId(getState());

  dispatch({ type: SURVEY_CREATE_REQUEST });

  const thunk = dispatch(
    doAuthenticatedRequest({
      requestUrl,
      method: 'post',
      data: { name: 'Productivity Index Survey', questions: surveyQuestions, orgId, startDate, endDate }
    })
  );

  thunk
    .then(response => dispatch({ type: SURVEY_CREATE_SUCCESS, payload: response.data }))
    .catch(() => dispatch({ type: SURVEY_CREATE_FAILURE }));

  return thunk;
};

export const oldFetchSurveys = () => (dispatch, getState) => {
  const {
    subscriberOrgs: { currentSubscriberOrgId },
    auth: { userId }
  } = getState();
  const requestUrl = buildApiUrl(`organizations/${currentSubscriberOrgId}/users/${userId}/surveys`, 'v2');

  const thunk = dispatch(
    doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    })
  );

  thunk.then(response => {
    const { dates } = response.data;
    dispatch({
      type: SURVEYS_FETCH_SUCCESS,
      payload: { dates }
    });
  });

  return thunk;
};

export const submitSurvey = data => (dispatch, getState) => {
  const {
    subscriberOrgs: { currentSubscriberOrgId },
    auth: { userId }
  } = getState();
  const requestUrl = buildApiUrl(`organizations/${currentSubscriberOrgId}/users/${userId}/surveys`, 'v2');

  dispatch({ type: SUBMIT_SURVEY_REQUEST });

  const thunk = dispatch(
    doAuthenticatedRequest({
      requestUrl,
      method: 'post',
      data
    })
  );

  thunk.then(() => dispatch({ type: SUBMIT_SURVEY_SUCCESS })).catch(() => dispatch({ type: SUBMIT_SURVEY_FAILURE }));
  return thunk;
};
