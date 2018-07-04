import axios from 'axios';
import Cookie from 'js-cookie';
import { push } from 'react-router-redux';

import config from '../config/env';
import { paths } from '../routes';
import { SUBMIT_REGISTRATION_FORM } from './types';
import {
  login,
  logout,
  fetchInvitations,
  receiveUserMyself,
  setCurrentSubscriberOrgId
} from './index';
import { clearCachedGetRequests } from '../redux-hablaai/actions';

const { hablaApiBaseUri } = config;

const LAST_ROUTE_COOKIE = 'lastRoute';
const LAST_SUBSCRIBER_ORG_ID_COOKIE = 'lastSubscriberOrgId';

// If the user is just going to /app, and their last route on logout was somewhere else, send them there.
const resolveRoute = (userId, targetRoute) => {
  const lastRouteCookieName = `${LAST_ROUTE_COOKIE}__${userId}`;
  const lastRoute = Cookie.get(lastRouteCookieName);
  let resolvedRoute = targetRoute;

  if (targetRoute === paths.app && lastRoute) {
    resolvedRoute = lastRoute;
    Cookie.remove(lastRouteCookieName);
  }
  return push(resolvedRoute);
};

const resolveSubscriberOrgId = (userId) => {
  const lastSubscriberOrgIdCookieName = `${LAST_SUBSCRIBER_ORG_ID_COOKIE}__${userId}`;
  const lastSubscriberOrgId = Cookie.get(lastSubscriberOrgIdCookieName);

  if (lastSubscriberOrgId && (lastSubscriberOrgId !== 'null')) {
    Cookie.remove(lastSubscriberOrgIdCookieName);
    return lastSubscriberOrgId;
  }
  return null;
};

export const loginUser = ({ email, password, targetRoute }) => {
  return (dispatch) => {
    dispatch(login(email, password))
      .then(({ data }) => {
        const { user } = data;
        const lastSubscriberOrgId = resolveSubscriberOrgId(user.userId);
        if (lastSubscriberOrgId) {
          dispatch(setCurrentSubscriberOrgId(lastSubscriberOrgId));
        }

        dispatch(receiveUserMyself(user));
        dispatch(fetchInvitations());
        dispatch(resolveRoute(user.userId, targetRoute));
      });
  };
};

export const logoutUser = () => {
  return (dispatch) => {
    dispatch(logout());
    dispatch(clearCachedGetRequests());
    dispatch(push(paths.login));
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
