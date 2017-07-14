import axios from "axios";
import config from '../config/env';
import { SUBMIT_FORM } from './types';

export * from './auth';
export * from './integrations';

export const RECEIVE_HOME_DATA = "RECEIVE_HOME_DATA";
export const RECEIVE_SUBPAGE_DATA = "RECEIVE_SUBPAGE_DATA";

// TODO: AD: Move apiUrl/apiEndpoints elsewhere, once I get the connection to server working.
export const apiUrl = "http://api.fixer.io";
export const API_URL = config.hablaApiBaseUri;
export const CLIENT_ROOT_URL = "http://localhost:8080";
const apiEndpoints = {
  testAPIHomepage: `${apiUrl}/latest?base=USD`,
  testAPISubpage: `${apiUrl}/latest?base=GBP`
};

export function submitRegistrationForm(data) {
  return {
    type: SUBMIT_FORM,
    data
  }
}

export function receiveHomeData(data) {
  return {
    type: RECEIVE_HOME_DATA,
    data
  };
}

export function requestHomeData() {
  return dispatch =>
    axios
      .get(apiEndpoints.testAPIHomepage)
      .then(response => response.data)
      .then(json => dispatch(receiveHomeData(json)));
}

export function receiveSubpageData(data) {
  return {
    type: RECEIVE_SUBPAGE_DATA,
    data
  };
}

export function requestSubpageData() {
  return dispatch =>
    axios
      .get(apiEndpoints.testAPISubpage)
      .then(response => response.data)
      .then(json => dispatch(receiveSubpageData(json)));
}

export function errorHandler(dispatch, error, type) {
  console.log("Error type: ", type);
  console.log(error);

  let errorMessage = error.response ? error.response.data : error;

  // NOT AUTHENTICATED ERROR
  if (error.status === 401 || error.response.status === 401) {
    errorMessage = "You are not authorized to do this.";
    return dispatch(logoutUser(errorMessage));
  }

  dispatch({
    type,
    payload: errorMessage
  });
}
