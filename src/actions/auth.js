import axios from 'axios';
import { push } from 'react-router-redux';
import config from '../config/env';
import { routesPaths } from '../routes';
import {
  LOGGING_IN,
  LOGGING_IN_ERROR,
  UNAUTH_USER,
  SUBMIT_REGISTRATION_FORM
} from './types';
import { fetchInvitations } from './index';
import { login, logout } from '../session';

const { hablaApiBaseUri } = config;

export const loginUser = ({ email, password, targetRoute }) => {
  return (dispatch) => {
    dispatch({ type: LOGGING_IN, payload: true });
    login(email, password)
      .then((lastRoute) => {
        // If the user is just going to the home page, and their last route on logout was somewhere else, send them there.
        let resolvedRoute = targetRoute;
        if ((targetRoute === routesPaths.app) && (lastRoute)) {
          resolvedRoute = lastRoute;
        }
        dispatch(fetchInvitations());
        dispatch({ type: LOGGING_IN, payload: false });
        dispatch(push(resolvedRoute));
      })
      .catch(() => {
        dispatch({ type: LOGGING_IN_ERROR, payload: false });
      });
  };
};

export const logoutUser = (error) => {
  return (dispatch) => {
    dispatch({
      type: UNAUTH_USER,
      payload: error || ''
    });
    logout();

    dispatch(push(routesPaths.login));
  };
};

export const submitRegistrationForm = (status) => {
  return {
    type: SUBMIT_REGISTRATION_FORM,
    payload: status
  };
};

export const verifyEmailAccount = (uuid) => {
  return () => {
    return axios
      .get(`${hablaApiBaseUri}/users/validateEmail/${uuid}`)
      .then((response) => {
        sessionStorage.setItem('habla-user-email', response.data.email);
      })
      .catch((error) => {
        throw new Error(error);
      });
  };
};

export const createAccount = (form) => {
  return () => {
    return axios
      .post(`${hablaApiBaseUri}/users/createUser`, form)
      .catch((error) => {
        throw new Error(error);
      });
  };
};
