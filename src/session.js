import _ from 'lodash';
import axios from 'axios';
import Cookie from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { persistStore } from 'redux-persist';
import { AUTH_USER } from './actions/types';
import config from './config/env';
import messaging from './redux-hablaai/messaging';
import messagingActionAdapter from './redux-hablaai/actions/messagingActionAdapter';
import reduxHablaaiConfig from './redux-hablaai/config';
import { onlineOfflineListener, clearCachedGetRequests } from './redux-hablaai/actions/urlRequest';
import { receiveUserMyself, setCurrentSubscriberOrgId } from './actions';

const TOKEN_COOKIE_NAME = 'token';
const WEBSOCKET_URL_COOKIE_NAME = 'websocketUrl';
const RESOURCES_URL_COOKIE_NAME = 'resourcesUrl';
const LAST_ROUTE_COOKIE_NAME_PREFIX = 'lastRoute';
const LAST_SUBSCRIBER_ORG_ID = 'lastSubscriberOrgId';

const AWS_CUSTOMER_ID_HEADER_NAME = 'x-hablaai-awsCustomerId';


let jwt;
let websocketUrl;
let resourcesUrl;
let _awsCustomerId;

let store;
let persistor;


export const initMessaging = () => {
  messaging(websocketUrl).connect(jwt);
  messaging().addEventListener(messagingActionAdapter);
  messaging().addOnlineOfflineListener(onlineOfflineListener);
};

export const closeMessaging = () => {
  const messagingInstance = messaging();
  if (messagingInstance) {
    messagingInstance.close();
  }
};

const storeLastRoute = () => {
  const decoded = jwtDecode(jwt);
  const userId = decoded._id;
  const currentState = store.getState();
  const { location: { pathname, search } } = currentState.router;
  const { currentSubscriberOrgId } = currentState.subscriberOrgs;

  if (currentSubscriberOrgId) {
    Cookie.set(`${LAST_ROUTE_COOKIE_NAME_PREFIX}__${userId}`, `${pathname}${search}`, { expires: 7 });
    Cookie.set(`${LAST_SUBSCRIBER_ORG_ID}__${userId}`, currentSubscriberOrgId, { expires: 7 });
  }
};

window.onbeforeunload = () => {
  closeMessaging();
  storeLastRoute();
  persistStore(store);
};


const loadCookieData = () => {
  jwt = Cookie.get(TOKEN_COOKIE_NAME);
  reduxHablaaiConfig.jwt = jwt;
  websocketUrl = Cookie.get(WEBSOCKET_URL_COOKIE_NAME);
  resourcesUrl = Cookie.get(RESOURCES_URL_COOKIE_NAME);
  reduxHablaaiConfig.resourceBaseUri = resourcesUrl;
};

export const sessionState = (restoredState) => {
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
};

export const setStore = (createdStore) => {
  store = createdStore;
  reduxHablaaiConfig.store = store;
};

export const setPersistor = (createdPersistor) => {
  persistor = createdPersistor;
};


export const getJwt = () => {
  return jwt;
};

export const getResourcesUrl = () => {
  return resourcesUrl;
};

export const setAwsCustomerId = (awsCustomerId) => {
  _awsCustomerId = awsCustomerId;
};

export const axiosOptionsForNewCustomer = () => {
  let axiosOptions;
  if (_awsCustomerId) {
    axiosOptions = { headers: {} };
    axiosOptions.headers[AWS_CUSTOMER_ID_HEADER_NAME] = _awsCustomerId;
  }
  return axiosOptions;
};


export const login = (email, password) => {
  return new Promise((resolve, reject) => {
    const loginUrl = `${config.hablaApiBaseUri}/auth/login`;
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    // axios.post(loginUrl, params, { withCredentials: true })
    const axiosOptions = axiosOptionsForNewCustomer();
    axios.post(loginUrl, params, axiosOptions)
      .then((response) => {
        jwt = response.data.token;
        reduxHablaaiConfig.jwt = jwt;
        websocketUrl = response.data.websocketUrl;
        resourcesUrl = `${response.data.resourcesBaseUrl}/resource`;
        reduxHablaaiConfig.resourceBaseUri = resourcesUrl;
        const user = _.cloneDeep(response.data.user);

        Cookie.set(TOKEN_COOKIE_NAME, jwt);
        Cookie.set(WEBSOCKET_URL_COOKIE_NAME, websocketUrl);
        Cookie.set(RESOURCES_URL_COOKIE_NAME, resourcesUrl);

        store.dispatch({
          type: AUTH_USER,
          payload: { user }
        });
        store.dispatch(receiveUserMyself(user));

        const userSpecificLastSubscriberOrgId = `${LAST_SUBSCRIBER_ORG_ID}__${user.userId}`;
        const currentSubscriberOrgId = Cookie.get(userSpecificLastSubscriberOrgId);
        if (currentSubscriberOrgId && (currentSubscriberOrgId !== 'null')) {
          store.dispatch(setCurrentSubscriberOrgId(currentSubscriberOrgId));
          Cookie.remove(userSpecificLastSubscriberOrgId);
        }

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
};

export const logout = () => {
  storeLastRoute();

  jwt = undefined;
  reduxHablaaiConfig.jwt = jwt;
  websocketUrl = undefined;
  resourcesUrl = undefined;
  reduxHablaaiConfig.resourceBaseUri = resourcesUrl;

  Cookie.remove(TOKEN_COOKIE_NAME);
  Cookie.remove(WEBSOCKET_URL_COOKIE_NAME);
  Cookie.remove(RESOURCES_URL_COOKIE_NAME);

  closeMessaging();
  clearCachedGetRequests();

  persistor.purge();

  // Logout with server, just in case any backend cleanup is necessary.
  const logoutUrl = `${config.hablaApiBaseUri}/auth/logout`;
  const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };
  axios.get(logoutUrl, axiosOptions);
};

export const isAuthenticated = () => {
  return (getJwt() !== undefined);
};
