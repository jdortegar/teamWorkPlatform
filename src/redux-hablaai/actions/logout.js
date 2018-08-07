import config from '../../config/env';
import { doAuthenticatedRequest } from './urlRequest';

export const LOGOUT_REQUEST = 'auth/logout/request';
export const LOGOUT_SUCCESS = 'auth/logout/success';
export const LOGOUT_FAILURE = 'auth/logout/failure';

export const logout = () => {
  const requestUrl = `${config.hablaApiBaseUri}/auth/logout`;

  return dispatch => {
    dispatch({ type: LOGOUT_REQUEST });

    const thunk = dispatch(
      doAuthenticatedRequest({
        requestUrl,
        method: 'get'
      })
    );

    thunk.then(() => dispatch({ type: LOGOUT_SUCCESS })).catch(error => {
      dispatch({
        type: LOGOUT_FAILURE,
        payload: { error }
      });
    });

    return thunk;
  };
};
