import axios from 'axios';
import { push } from 'react-router-redux';
import config from '../config/env';
import { routesPaths } from '../routes';
import {
  LOGGING_IN,
  UNAUTH_USER,
  SUBMIT_REGISTRATION_FORM
} from './types';
import { login, logout } from '../session';

const { hablaApiBaseUri } = config;

export function loginUser({ email, password, targetRoute }) {
  return (dispatch) => {
    dispatch({ type: LOGGING_IN, payload: true });
    login(email, password)
      .then((lastRoute) => {
        // If the user is just going to the home page, and their last route on logout was somewhere else, send them there.
        let resolvedRoute = targetRoute;
        if ((targetRoute === routesPaths.home) && (lastRoute)) {
          resolvedRoute = lastRoute;
        }
        dispatch({ type: LOGGING_IN, payload: false });
        dispatch(push(resolvedRoute));
      })
      .catch(() => {
        dispatch({ type: LOGGING_IN, payload: false });
      });
  };
}

export function logoutUser(error) {
  return (dispatch) => {
    dispatch({
      type: UNAUTH_USER,
      payload: error || ''
    });
    logout();

    dispatch(push(routesPaths.login));
  };
}

export function submitRegistrationForm(status) {
  return {
    type: SUBMIT_REGISTRATION_FORM,
    payload: status
  };
}

export function verifyEmailAccount(uuid) {
  return () => {
    return axios
      .get(`${hablaApiBaseUri}/users/validateEmail/${uuid}`)
      .then((response) => {
        sessionStorage.setItem('habla-user-email', response.data.email);
      })
      .catch((error) => {
        console.log(error.response);
        throw new Error(error);
      });
  };
}
