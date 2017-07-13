import axios from 'axios';
import Cookie from 'js-cookie';
import _ from 'lodash';
import config from './config/env';
import messaging from './messaging';

const TOKEN_COOKIE_NAME = 'token';
const WEBSOCKET_URL_COOKIE_NAME = 'websocketUrl';

let jwt;
let websocketUrl;

export function getJwt() {
  if (jwt) {
    return jwt;
  }

  jwt = Cookie.get(TOKEN_COOKIE_NAME);
  return jwt;
}

function initializeDependencies() {
  messaging(websocketUrl).connect(jwt);
}

function disableDependencies() {
  const messagingInstance = messaging();
  if (messagingInstance) {
    messagingInstance.close();
  }
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
        if (process.env.NODE_ENV === 'production') {
          Cookie.set(TOKEN_COOKIE_NAME, jwt, { secure: true });
          Cookie.set(WEBSOCKET_URL_COOKIE_NAME, websocketUrl, { secure: true });
        } else {
          Cookie.set(TOKEN_COOKIE_NAME, jwt);
          Cookie.set(WEBSOCKET_URL_COOKIE_NAME, websocketUrl);
        }

        initializeDependencies();
        const user = _.cloneDeep(response.data.user);
        delete user.email;
        resolve(user);
      })
      .catch(err => reject(err));
  });
}

export function logout() {
  jwt = undefined;
  if (process.env.NODE_ENV === 'production') {
    Cookie.remove(TOKEN_COOKIE_NAME, { secure: true });
    Cookie.remove(WEBSOCKET_URL_COOKIE_NAME, { secure: true });
  } else {
    Cookie.remove(TOKEN_COOKIE_NAME);
    Cookie.remove(WEBSOCKET_URL_COOKIE_NAME);
  }

  disableDependencies();
  // TODO: ANT: axios call to logout.  No return promise necessary.
}

export function isAuthenticated() {
  return (getJwt() !== undefined);
}
