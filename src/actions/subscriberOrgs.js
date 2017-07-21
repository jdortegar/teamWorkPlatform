import axios from 'axios';
import config from '../config/env';
import { getJwt } from '../session';
import {
  REQUEST_SUBSCRIBER_ORGS,
  RECEIVE_SUBSCRIBER_ORGS,
  REQUEST_SUBSCRIBER_ORGS_ERROR,
  SET_CURRENT_SUBSCRIBER_ORG,
  SUBMITTING_ORG_FORM,
  CREATE_SUBSCRIBER_ORG,
  SHOW_ORG_DIALOG
} from './types';

export function requestingSubscriberOrgs() {
  return { type: REQUEST_SUBSCRIBER_ORGS };
}

export function inviteUser(users, susbcriberOrg) {
  const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };

  return (dispatch) => {
    return axios.post(`${config.hablaApiBaseUri}/subscriberOrgs/inviteSubscribers/${susbcriberOrg}`, { userIdOrEmails: users }, axiosOptions)
      .then((response) => {
        console.log(response);
      })
      .catch();
  };
}

export function receiveSubscriberOrgs(subscriberOrgs) {
  return {
    type: RECEIVE_SUBSCRIBER_ORGS,
    payload: subscriberOrgs
  };
}

export function requestSubscriberOrgsError(error) {
  return { type: REQUEST_SUBSCRIBER_ORGS_ERROR, payload: error, error: true };
}

export function requestSubscriberOrgs() {
  const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };

  return (dispatch) => {
    dispatch(requestingSubscriberOrgs());
    return axios.get(`${config.hablaApiBaseUri}/subscriberOrgs/getSubscriberOrgs`, axiosOptions)
      .then(response => response.data.subscriberOrgs)
      .then(subscriberOrgs => dispatch(receiveSubscriberOrgs(subscriberOrgs)))
      .catch(err => dispatch(requestSubscriberOrgsError(err)));
  };
}

export function createSubscriberOrg(name) {
  const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };

  return (dispatch) => {
    dispatch({ type: SUBMITTING_ORG_FORM, payload: true });
    return axios.post(`${config.hablaApiBaseUri}/subscriberOrgs/createSubscriberOrg`, name, axiosOptions)
      .then((response) => {
        dispatch({ type: CREATE_SUBSCRIBER_ORG, payload: response.data })
        dispatch({ type: SUBMITTING_ORG_FORM, payload: false });
        dispatch({ type: SHOW_ORG_DIALOG, payload: false });
      })
      .catch(err => {
        dispatch({ type: SUBMITTING_ORG_FORM, payload: false });
      });
  };
}

export function setCurrentSubscriberOrg(subscriberOrg) {
  return {
    type: SET_CURRENT_SUBSCRIBER_ORG,
    payload: subscriberOrg
  };
}
