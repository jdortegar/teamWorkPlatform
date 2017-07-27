import axios from 'axios';
import config from '../config/env';
import { getJwt } from '../session';
import {
  REQUESTING_SUBSCRIBER_ORGS,
  RECEIVE_SUBSCRIBER_ORGS,
  REQUEST_SUBSCRIBER_ORGS_ERROR,
  SET_CURRENT_SUBSCRIBER_ORG_ID,
  SUBMITTING_ORG_FORM,
  CREATE_SUBSCRIBER_ORG,
  SHOW_ORG_DIALOG
} from './types';

function requestingSubscriberOrgs() {
  return { type: REQUESTING_SUBSCRIBER_ORGS };
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
  return (dispatch, getState) => {
    if (!getState().subscriberOrgs.requesting) {
      dispatch(requestingSubscriberOrgs());
      const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };
      return axios.get(`${config.hablaApiBaseUri}/subscriberOrgs/getSubscriberOrgs`, axiosOptions)
        .then(response => response.data.subscriberOrgs)
        .then(subscriberOrgs => dispatch(receiveSubscriberOrgs(subscriberOrgs)))
        .catch(err => dispatch(requestSubscriberOrgsError(err)));
    }
    return Promise.resolve();
  };
}

export function setCurrentSubscriberOrgId(subscriberOrgId) {
  return {
    type: SET_CURRENT_SUBSCRIBER_ORG_ID,
    payload: subscriberOrgId
  };
}

export function createSubscriberOrg(name) {
  const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };

  return (dispatch) => {
    dispatch({ type: SUBMITTING_ORG_FORM, payload: true });
    return axios.post(`${config.hablaApiBaseUri}/subscriberOrgs/createSubscriberOrg`, name, axiosOptions)
      .then((response) => {
        dispatch({ type: CREATE_SUBSCRIBER_ORG, payload: response.data });
        dispatch({ type: SUBMITTING_ORG_FORM, payload: false });
      })
      .catch(err =>  {
        dispatch({ type: SUBMITTING_ORG_FORM, payload: false });
      });
  };
}
