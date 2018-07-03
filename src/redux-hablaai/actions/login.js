import axios from 'axios';

import config from '../../config/env';

export const LOGIN_REQUEST = 'auth/login/request';
export const LOGIN_SUCCESS = 'auth/login/success';
export const LOGIN_FAILURE = 'auth/login/failure';

export const login = ({ email, password }) => {
  const requestUrl = `${config.hablaApiBaseUri}/auth/login`;
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);

  return (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });

    const thunk = axios.post(requestUrl, params);

    thunk
      .then((response) => {
        const { user, token, websocketUrl, resourcesUrl } = response.data;
        dispatch({
          type: LOGIN_SUCCESS,
          payload: {
            user,
            token,
            websocketUrl,
            resourcesUrl: `${resourcesUrl}/resource`
          }
        });
      })
      .catch((error) => {
        dispatch({
          type: LOGIN_FAILURE,
          payload: { error }
        });
      });

    return thunk;
  };
};
