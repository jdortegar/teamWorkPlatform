import axios from 'axios';
import Cookie from 'js-cookie';
import config from './config/env';
import messaging from './messaging';

const TOKEN_COOKIE_NAME = 'token';
const WEBSOCKET_URL_COOKIE_NAME = 'websocketUrl';
const COOKIE_USER = 'user';

let jwt;
let websocketUrl;
let user;

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
  messaging().close();
}

// Try to keep websocketUrl private.
// export function getWebsocketUrl() {
//   if (websocketUrl) {
//     return websocketUrl;
//   }
//
//   websocketUrl = Cookie.get(WEBSOCKET_URL_COOKIE_NAME);
//   if (websocketUrl) {
//     initializeDependencies();
//   }
//   return websocketUrl;
// }

export function login(email, password) {
  return new Promise((resolve, reject) => {
    const loginUrl = `${config.hablaApiBaseUri}/auth/login`;
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    axios.post(loginUrl, params)
      .then((response) => {
        jwt = response.data.token;
        user = response.data.user;
        websocketUrl = response.data.websocketUrl;
        if (process.env.NODE_ENV === 'production') {
          Cookie.set(TOKEN_COOKIE_NAME, jwt, { secure: true });
          Cookie.set(WEBSOCKET_URL_COOKIE_NAME, websocketUrl, { secure: true });
          Cookie.set(COOKIE_USER, user, { secure: true });
        } else {
          Cookie.set(TOKEN_COOKIE_NAME, jwt);
          Cookie.set(WEBSOCKET_URL_COOKIE_NAME, websocketUrl);
          Cookie.set(COOKIE_USER, user);
        }

        initializeDependencies();
        resolve(response.data.user);
      })
      .catch(err => reject(err));
  });
}

export function logout() {
  jwt = undefined;
  if (process.env.NODE_ENV === 'production') {
    Cookie.remove(TOKEN_COOKIE_NAME, { secure: true });
    Cookie.remove(WEBSOCKET_URL_COOKIE_NAME, { secure: true });
    Cookie.remove(COOKIE_USER, { secure: true });
  } else {
    Cookie.remove(TOKEN_COOKIE_NAME);
    Cookie.remove(WEBSOCKET_URL_COOKIE_NAME);
    Cookie.remove(COOKIE_USER);
  }

  disableDependencies();
  // TODO: ANT: axios call to logout.  No return promise necessary.
}

export function isAuthenticated() {
  return (getJwt() !== undefined);
}
