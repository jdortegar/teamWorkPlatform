import axios from 'axios';

import config from '../../config/env';

export const LOGIN_REQUEST = 'auth/login/request';
export const LOGIN_SUCCESS = 'auth/login/success';
export const LOGIN_FAILURE = 'auth/login/failure';

const AWS_CUSTOMER_ID_HEADER_NAME = 'x-hablaai-awsCustomerId';

export const getAwsHeaders = awsCustomerId => {
  if (!awsCustomerId) return null;
  return { headers: { [AWS_CUSTOMER_ID_HEADER_NAME]: awsCustomerId } };
};

export const login = (email, password, awsCustomerId) => {
  const requestUrl = `${config.hablaApiBaseUri}/auth/login`;
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);

  return dispatch => {
    dispatch({ type: LOGIN_REQUEST });

    const thunk = axios.post(requestUrl, params, getAwsHeaders(awsCustomerId));

    thunk
      .then(response => {
        const { user, token, websocketUrl, resourcesBaseUrl } = response.data;
        dispatch({
          type: LOGIN_SUCCESS,
          payload: {
            user,
            token,
            websocketUrl,
            resourcesUrl: `${resourcesBaseUrl}/resource`
          }
        });
      })
      .catch(error => {
        dispatch({
          type: LOGIN_FAILURE,
          payload: { error }
        });
      });

    return thunk;
  };
};
