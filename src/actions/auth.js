import axios from 'axios';
import { push } from 'react-router-redux';

import config from '../config/env';
import { paths } from '../routes';
import {
  login,
  logout,
  closeMessaging,
  getLastRouteCookie,
  getLastSubscriberOrgIdCookie,
  saveCookies,
  fetchInvitations,
  receiveUser,
  setCurrentSubscriberOrgId,
  clearCachedGetRequests
} from './index';

const { hablaApiBaseUri } = config;

// If the user is just going to /app, and their last route on logout was somewhere else, send them there.
const resolveRoute = (userId, targetRoute) => {
  let resolvedRoute = targetRoute;
  const lastRoute = getLastRouteCookie(userId);

  if (targetRoute === paths.app && lastRoute) {
    resolvedRoute = lastRoute;
  }
  return push(resolvedRoute);
};

export const loginUser = ({ email, password, targetRoute }) => {
  return (dispatch) => {
    dispatch(login(email, password))
      .then(({ data }) => {
        const { user } = data;
        const lastSubscriberOrgId = getLastSubscriberOrgIdCookie(user.userId);
        if (lastSubscriberOrgId) {
          dispatch(setCurrentSubscriberOrgId(lastSubscriberOrgId));
        }

        dispatch(receiveUser(user));
        dispatch(fetchInvitations());
        dispatch(resolveRoute(user.userId, targetRoute));
      });
  };
};

export const logoutUser = () => {
  return (dispatch) => {
    dispatch(closeMessaging());
    dispatch(saveCookies());
    dispatch(logout());
    clearCachedGetRequests();
    dispatch(push(paths.login));
  };
};

export const verifyEmailAccount = (uuid) => {
  return () => {
    return axios
      .get(`${hablaApiBaseUri}/users/validateEmail/${uuid}`)
      .then((response) => {
        sessionStorage.setItem('habla-user-email', response.data.email);
      });
  };
};

export const createAccount = (form) => {
  return () => {
    return axios.post(`${hablaApiBaseUri}/users/createUser`, form);
  };
};

export const setNewPassword = (rid, password) => {
  return (dispatch) => {
    return axios
      .post(
        `${hablaApiBaseUri}/users/resetPassword/${rid}`,
        { password }
      ).then(() => {
        dispatch(push(paths.login));
      });
  };
};
