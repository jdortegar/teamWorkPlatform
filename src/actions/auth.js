import axios from 'axios';
import { push } from 'react-router-redux';

import config from '../config/env';
import { paths } from '../routes';
import {
  login,
  logout,
  closeMessaging,
  fetchInvitations,
  receiveUser,
  setCurrentSubscriberOrgId,
  clearCachedGetRequests
} from '../redux-hablaai/actions';
import { getLastRouteCookie, getLastSubscriberOrgIdCookie, saveCookies } from './cookies';

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

export const loginUser = ({ email, password, targetRoute, awsCustomerId }) => dispatch => {
  dispatch(login(email, password, awsCustomerId)).then(({ data }) => {
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

export const logoutUser = () => dispatch => {
  dispatch(closeMessaging());
  dispatch(saveCookies());
  dispatch(logout());
  clearCachedGetRequests();
  dispatch(push(paths.login));
};

export const verifyEmailAccount = uuid => () =>
  axios.get(`${hablaApiBaseUri}/users/validateEmail/${uuid}`).then(response => {
    sessionStorage.setItem('habla-user-email', response.data.email);
  });

export const createAccount = form => () => axios.post(`${hablaApiBaseUri}/users/createUser`, form);

export const setNewPassword = (rid, password) => dispatch =>
  axios.post(`${hablaApiBaseUri}/users/resetPassword/${rid}`, { password }).then(() => {
    dispatch(push(paths.login));
  });
