import axios from "axios";
import { browserHistory } from "react-router";
import cookie from "react-cookie";
import config from "../config/env";
import { errorHandler } from "./index";
import {
  AUTH_USER,
  AUTH_ERROR,
  UNAUTH_USER,
  FORGOT_PASSWORD_REQUEST,
  RESET_PASSWORD_REQUEST,
  PROTECTED_TEST
} from "./types";

//= ===============================
// Authentication actions
//= ===============================
const API_URL = config.hablaApiBaseUri;
// TO-DO: Add expiration to cookie
export function loginUser({ email, password }) {
  console.log("auth.loginUser:", { email, password });
  return dispatch => {
    axios
      .post(`${API_URL}/auth/login`, {
        email,
        password
      })
      .then(response => {
        cookie.save("token", response.data.token, {
          path: "/"
        });
        cookie.save("user", response.data.user, {
          path: "/"
        });
        dispatch({
          type: AUTH_USER
        });
        window.location.href = `${CLIENT_ROOT_URL}/dashboard`;
      })
      .catch(error => {
        errorHandler(dispatch, error.response, AUTH_ERROR);
      });
  };
}

export function registerUser({ email }) {
  console.log("auth.registerUser", { email });
  return dispatch => {
    axios
      .post(`${API_URL}/users/register`, { email })
      .then(response => {
        console.log("auth.registerUser response:", response);
        cookie.save("token", response.data.token, {
          path: "/"
        });
        cookie.save("user", response.data.user, {
          path: "/"
        });
        dispatch({
          type: AUTH_USER
        });
        window.location.href = `${CLIENT_ROOT_URL}/dashboard`;
        console.log("auth.registerUser response:", response);
      })
      .catch(error => {
        errorHandler(dispatch, error.response, AUTH_ERROR);
        console.log(error.response);
        console.log("auth.registerUser response:", error);
      });
  };
}

export function logoutUser(error) {
  return dispatch => {
    dispatch({
      type: UNAUTH_USER,
      payload: error || ""
    });
    cookie.remove("token", {
      path: "/"
    });
    cookie.remove("user", {
      path: "/"
    });

    window.location.href = `${CLIENT_ROOT_URL}/login`;
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
        // browserHistory.push("/login");
      })
      .catch(error => {
        errorHandler(dispatch, error.response, AUTH_ERROR);
      });
  };
}

export function protectedTest() {
  return dispatch => {
    axios
      .get(`${API_URL}/protected`, {
        headers: {
          Authorization: cookie.load("token")
        }
      })
      .then(response => {
        dispatch({
          type: PROTECTED_TEST,
          payload: response.data.content
        });
      })
      .catch(error => {
        errorHandler(dispatch, error.response, AUTH_ERROR);
      });
  };
}
