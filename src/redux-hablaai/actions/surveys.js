import config from 'config/env';
import { doAuthenticatedRequest } from './urlRequest';

export const SURVEYS_FETCH_SUCCESS = 'surveys/fetch/success';
export const SUBMIT_SURVEY_REQUEST = 'surveys/submit/request';
export const SUBMIT_SURVEY_SUCCESS = 'surveys/submit/success';
export const SUBMIT_SURVEY_FAILURE = 'surveys/submit/failure';

export const fetchSurveys = (options = { getKey: false, forceGet: true }) => (dispatch, getState) => {
  const {
    subscriberOrgs: { currentSubscriberOrgId },
    auth: { userId }
  } = getState();
  const baseUrl = config.hablaApiBaseUri.replace('v1', 'v2');
  const requestUrl = `${baseUrl}/organizations/${currentSubscriberOrgId}/users/${userId}/surveys`;

  const thunk = dispatch(
    doAuthenticatedRequest(
      {
        requestUrl,
        method: 'get'
      },
      {},
      options
    )
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
  const baseUrl = config.hablaApiBaseUri.replace('v1', 'v2');
  const requestUrl = `${baseUrl}/organizations/${currentSubscriberOrgId}/users/${userId}/surveys`;

  dispatch({ type: SUBMIT_SURVEY_REQUEST });

  const thunk = dispatch(
    doAuthenticatedRequest({
      requestUrl,
      method: 'post',
      data
    })
  );

  return thunk
    .then(() => dispatch({ type: SUBMIT_SURVEY_SUCCESS }))
    .catch(() => dispatch({ type: SUBMIT_SURVEY_FAILURE }));
};
