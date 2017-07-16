import axios from 'axios';
import Cookie from 'js-cookie';
import jwtDecode from 'jwt-decode';
import _ from 'lodash';
import { persistStore } from 'redux-persist';
import { AUTH_USER } from './actions/types';
import config from './config/env';
import messaging from './messaging';

const TOKEN_COOKIE_NAME = 'token';
const WEBSOCKET_URL_COOKIE_NAME = 'websocketUrl';
const LAST_ROUTE_COOKIE_NAME = 'lastRoute';

let jwt;
let websocketUrl;

let store;
let persistor;


function initMessaging() {
  messaging(websocketUrl).connect(jwt);
}

function closeMessaging() {
  const messagingInstance = messaging();
  if (messagingInstance) {
    messagingInstance.close();
  }
}

window.onbeforeunload = () => {
  closeMessaging();
  const { location } = store.getState().router;
  const { pathname, search } = location;
  console.log(`AD: ${pathname}${search}`);
  persistStore(store);
};


function loadCookieData() {
  jwt = Cookie.get(TOKEN_COOKIE_NAME);
  websocketUrl = Cookie.get(WEBSOCKET_URL_COOKIE_NAME);
}

export function sessionState(restoredState) {
  if (!jwt) {
    loadCookieData();
  }

  // Sync.  Blow away storage data if cookie user does not match storage user.
  if (jwt) {
    const decoded = jwtDecode(jwt);
    const userId = decoded._id;
    const persistedUser = restoredState.auth.user;
    if ((persistedUser) && (userId === persistedUser.userId)) {
      return restoredState;
    }
  }

  return undefined;
}

export function setStore(createdStore) {
  store = createdStore;
}

export function setPersistor(createdPersistor) {
  persistor = createdPersistor;
}


export function getJwt() {
  return jwt;
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
        websocketUrl = response.data.websocketUrl;
        const user = _.cloneDeep(response.data.user);
        delete user.email;

        if (process.env.NODE_ENV === 'production') {
          Cookie.set(TOKEN_COOKIE_NAME, jwt, { secure: true });
          Cookie.set(WEBSOCKET_URL_COOKIE_NAME, websocketUrl, { secure: true });
        } else {
          Cookie.set(TOKEN_COOKIE_NAME, jwt);
          Cookie.set(WEBSOCKET_URL_COOKIE_NAME, websocketUrl);
        }

        store.dispatch({
          type: AUTH_USER,
          payload: { user }
        });
        persistStore(store);

        initMessaging();

        resolve(user);
      })
      .catch(err => reject(err));
  });
}

export function logout() {
  jwt = undefined;
  websocketUrl = undefined;
  if (process.env.NODE_ENV === 'production') {
    Cookie.remove(TOKEN_COOKIE_NAME, { secure: true });
    Cookie.remove(WEBSOCKET_URL_COOKIE_NAME, { secure: true });
  } else {
    Cookie.remove(TOKEN_COOKIE_NAME);
    Cookie.remove(WEBSOCKET_URL_COOKIE_NAME);
  }

  closeMessaging();
  persistor.purge();

  // TODO: ANT: axios call to logout.  No return promise necessary.
}

export function isAuthenticated() {
  return (getJwt() !== undefined);
}
