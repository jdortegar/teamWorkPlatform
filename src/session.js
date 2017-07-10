import axios from 'axios';
import Cookie from 'js-cookie';
import config from './config/env';

const TOKEN_COOKIE_NAME = 'token';
let jwt;

export function login(email, password) {
  return new Promise((resolve, reject) => {
    const loginUrl = `${config.hablaApiBaseUri}/auth/login`;
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    axios.post(loginUrl, params)
      .then((response) => {
        jwt = response.data.token;
        Cookie.set(TOKEN_COOKIE_NAME, jwt);
        resolve();
      })
      .catch(err => reject(err));
  });
}

export function logout() {
  jwt = undefined;
  Cookie.remove(TOKEN_COOKIE_NAME);

  // TODO: ANT: axios call to logout... no need for promise here.
}

export function isAuthenticated() {
  if (jwt) {
    return true;
  }

  jwt = Cookie.get(TOKEN_COOKIE_NAME);
  return (jwt !== undefined);
}
