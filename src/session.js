import _ from 'lodash';
import axios from 'axios';
import Cookie from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { persistStore } from 'redux-persist';
import { AUTH_USER } from './actions/types';
import config from './config/env';
import messaging from './redux-hablaai/messaging';
import messagingActionAdapter from './redux-hablaai/actions/messagingActionAdapter';
import uiMessagingActionAdapter from './actions/messagingActionAdapter';
import reduxHablaaiConfig from './redux-hablaai/config';
import { onlineOfflineListener } from './redux-hablaai/actions/urlRequest';
import { receiveUserMyself } from './actions';

const TOKEN_COOKIE_NAME = 'token';
const WEBSOCKET_URL_COOKIE_NAME = 'websocketUrl';
const RESOURCES_URL_COOKIE_NAME = 'resourcesUrl';
const LAST_ROUTE_COOKIE_NAME_PREFIX = 'lastRoute';

let jwt;
let websocketUrl;
let resourcesUrl;

let store;
let persistor;


export function initMessaging() {
  messaging(websocketUrl).connect(jwt);
  messaging().addEventListener(messagingActionAdapter);
  messaging().addEventListener(uiMessagingActionAdapter);
  messaging().addOnlineOfflineListener(onlineOfflineListener);
}

function closeMessaging() {
  const messagingInstance = messaging();
  if (messagingInstance) {
    messagingInstance.close();
  }
}

window.onbeforeunload = () => {
  closeMessaging();
  persistStore(store);
};


function loadCookieData() {
  jwt = Cookie.get(TOKEN_COOKIE_NAME);
  reduxHablaaiConfig.jwt = jwt;
  websocketUrl = Cookie.get(WEBSOCKET_URL_COOKIE_NAME);
  resourcesUrl = Cookie.get(RESOURCES_URL_COOKIE_NAME);
  reduxHablaaiConfig.resourceBaseUri = resourcesUrl;
}

export function sessionState(restoredState) {
  if (!jwt) {
    loadCookieData();
  }

  // Sync.  Blow away storage data if cookie user does not match storage user.
  if (jwt) {
    const decoded = jwtDecode(jwt);
    const userId = decoded._id;
    const persistedUser = (restoredState.auth) ? restoredState.auth.user : undefined;
    if ((persistedUser) && (userId === persistedUser.userId)) {
      return restoredState;
    }
  }

  return undefined;
}

export function setStore(createdStore) {
  store = createdStore;
  reduxHablaaiConfig.store = store;
}

export function setPersistor(createdPersistor) {
  persistor = createdPersistor;
}


export function getJwt() {
  return jwt;
}

export function getResourcesUrl() {
  return resourcesUrl;
}


export function login(email, password) {
  return new Promise((resolve, reject) => {
    const loginUrl = `${config.hablaApiBaseUri}/auth/login`;
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    axios.post(loginUrl, params)
      .then((response) => {
        jwt = response.data.token;
        reduxHablaaiConfig.jwt = jwt;
        websocketUrl = response.data.websocketUrl;
        resourcesUrl = `${response.data.resourcesBaseUrl}/resource`;
        reduxHablaaiConfig.resourceBaseUri = resourcesUrl;
        const user = _.cloneDeep(response.data.user);
        delete user.email;

        // if (process.env.NODE_ENV === 'production') {
        //   Cookie.set(TOKEN_COOKIE_NAME, jwt, { secure: true });
        //   Cookie.set(WEBSOCKET_URL_COOKIE_NAME, websocketUrl, { secure: true });
        //   Cookie.set(RESOURCES_URL_COOKIE_NAME, resourcesUrl, { secure: true });
        // } else {
        Cookie.set(TOKEN_COOKIE_NAME, jwt);
        Cookie.set(WEBSOCKET_URL_COOKIE_NAME, websocketUrl);
        Cookie.set(RESOURCES_URL_COOKIE_NAME, resourcesUrl);
        // }

        store.dispatch({
          type: AUTH_USER,
          payload: { user }
        });
        store.dispatch(receiveUserMyself(user));
        persistStore(store);

        initMessaging();

        // Get last know route if available.
        const userSpecificLastRouteCookieName = `${LAST_ROUTE_COOKIE_NAME_PREFIX}__${user.userId}`;
        const lastRoute = Cookie.get(userSpecificLastRouteCookieName);
        if (lastRoute) {
          Cookie.remove(userSpecificLastRouteCookieName);
        }
        resolve(lastRoute);
      })
      .catch(err => reject(err));
  });
}

export function logout() {
  const decoded = jwtDecode(jwt);
  const userId = decoded._id;

  jwt = undefined;
  reduxHablaaiConfig.jwt = jwt;
  websocketUrl = undefined;
  resourcesUrl = undefined;
  reduxHablaaiConfig.resourceBaseUri = resourcesUrl;
  // if (process.env.NODE_ENV === 'production') {
  //   Cookie.remove(TOKEN_COOKIE_NAME, { secure: true });
  //   Cookie.remove(WEBSOCKET_URL_COOKIE_NAME, { secure: true });
  //   Cookie.remove(RESOURCES_URL_COOKIE_NAME, { secure: true });
  // } else {
  Cookie.remove(TOKEN_COOKIE_NAME);
  Cookie.remove(WEBSOCKET_URL_COOKIE_NAME);
  Cookie.remove(RESOURCES_URL_COOKIE_NAME);
  // }

  closeMessaging();

  persistor.purge();

  const { location } = store.getState().router;
  const { pathname, search } = location;
  // if (process.env.NODE_ENV === 'production') {
  //   Cookie.set(`${LAST_ROUTE_COOKIE_NAME_PREFIX}__${userId}`, `${pathname}${search}`, { secure: true, expires: 7 });
  // } else {
  Cookie.set(`${LAST_ROUTE_COOKIE_NAME_PREFIX}__${userId}`, `${pathname}${search}`, { expires: 7 });
  // }

  // Logout with server, just in case any backend cleanup is necessary.
  const logoutUrl = `${config.hablaApiBaseUri}/auth/logout`;
  const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };
  axios.get(logoutUrl, axiosOptions);
}

export function isAuthenticated() {
  return (getJwt() !== undefined);
}
