import axios from 'axios';
import cookie from 'react-cookie';
import config from './config/env';

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
        // TODO: cookie.save('token', jwt, { path: '/' });
        resolve();
      })
      .catch(err => reject(err));
  });
}

export function logout() {
  jwt = undefined;
  // TODO: cookie.remove('token', jwt, { path: '/' });
  // TODO: invoke logout on server.
}

export function isAuthenticated() {
  if (jwt) {
    return true;
  }

  // Check cookie.
  // TODO: jwt = cookie.load('token');
  return (jwt !== undefined);
}
