import axios from 'axios';
import { push } from 'react-router-redux';
import { API_URL, CLIENT_ROOT_URL, errorHandler } from './index';
import { routesPaths } from '../routes';
import {
  AUTH_USER,
  AUTH_ERROR,
  UNAUTH_USER,
  FORGOT_PASSWORD_REQUEST,
  RESET_PASSWORD_REQUEST,
  PROTECTED_TEST,
  SUBMIT_FORM
} from './types';
import { login, logout } from '../session';

//= ===============================
// Authentication actions
//= ===============================
export function loginUser({ email, password }) {
  return dispatch => {
    login(email, password)
      .then(() => {
        dispatch({
          type: AUTH_USER
        });
        dispatch(push(routesPaths.home));
      })
      .catch((error) => {
        errorHandler(dispatch, error.response, AUTH_ERROR);
        console.log(error);
      });
  };
}

export function registerUser({ email }) {
  return dispatch => {
    dispatch({ type: SUBMIT_FORM, data: true });
    axios
      .post(`${API_URL}/users/registerUser`, { email })
      .then(response => {
        dispatch({ type: AUTH_USER });
        dispatch({ type: SUBMIT_FORM, data: false });
        dispatch(push('/dashboard'));
      })
      .catch(error => {
        dispatch({ type: SUBMIT_FORM, data: false });
        errorHandler(dispatch, error.response, AUTH_ERROR);
        console.log(error.response);
        console.log('auth.registerUser response:', error);
      });
  };
}

export function logoutUser(error) {
  logout();

  return dispatch => {
    dispatch({
      type: UNAUTH_USER,
      payload: error || ''
    });

    dispatch(push(routesPaths.login));
  };
}

export function getForgotPasswordToken({ email }) {
  return dispatch => {
    axios
      .post(`${API_URL}/auth/forgot-password`, {
        email
      })
      .then(response => {
        dispatch({
          type: FORGOT_PASSWORD_REQUEST,
          payload: response.data.message
        });
      })
      .catch(error => {
        errorHandler(dispatch, error.response, AUTH_ERROR);
      });
  };
}

export function resetPassword(token, { password }) {
  return dispatch => {
    axios
      .post(`${API_URL}/auth/reset-password/${token}`, {
        password
      })
      .then(response => {
        dispatch({
          type: RESET_PASSWORD_REQUEST,
          payload: response.data.message
        });
        // Redirect to login page on successful password reset
        // browserHistory.push('/login');
      })
      .catch(error => {
        errorHandler(dispatch, error.response, AUTH_ERROR);
      });
  };
}

// export function protectedTest() {
//   return dispatch => {
//     axios
//       .get(`${API_URL}/protected`, {
//         headers: {
//           Authorization: cookie.load('token')
//         }
//       })
//       .then(response => {
//         dispatch({
//           type: PROTECTED_TEST,
//           payload: response.data.content
//         });
//       })
//       .catch(error => {
//         errorHandler(dispatch, error.response, AUTH_ERROR);
//       });
//   };
// }
