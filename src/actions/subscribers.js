import axios from 'axios';
import config from '../config/env';
import { getJwt } from '../session';
import {
  REQUESTING_SUBSCRIBERS,
  RECEIVE_SUBSCRIBERS,
  REQUEST_SUBSCRIBERS_ERROR
} from './types';

function requestingSubscribers(subscriberOrgId) {
  return { type: REQUESTING_SUBSCRIBERS, payload: { subscriberOrgId } };
}

export function receiveSubscribers(subscribers, subscriberOrgId) {
  return {
    type: RECEIVE_SUBSCRIBERS,
    payload: { subscribers, subscriberOrgId }
  };
}

export function requestSubscribersError(error, subscriberOrgId) {
  return { type: REQUEST_SUBSCRIBERS_ERROR, meta: { subscriberOrgId }, payload: error, error: true };
}

export function requestSubscribers(subscriberOrgId) {
  return (dispatch, getState) => {
    if (!getState().subscriberOrgs.requesting) {
      dispatch(requestingSubscribers());
      const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };
      return axios.get(`${config.hablaApiBaseUri}/subscriberOrgs/getSubscribers/${subscriberOrgId}`, axiosOptions)
        .then(response => response.data.subscribers)
        .then(subscribers => dispatch(receiveSubscribers(subscribers)))
        .catch(err => dispatch(requestSubscribersError(err, subscriberOrgId)));
    }
    return Promise.resolve();
  };
}
