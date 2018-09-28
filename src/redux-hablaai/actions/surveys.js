import { buildApiUrl } from 'src/lib/api';
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
  const requestUrl = buildApiUrl(`organizations/${currentSubscriberOrgId}/users/${userId}/surveys`, 'v2');

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
