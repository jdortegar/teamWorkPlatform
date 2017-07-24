import axios from 'axios';
import config from '../config/env';
import { getJwt } from '../session';
import {
  REQUESTING_INTEGRATIONS,
  RECEIVE_INTEGRATIONS,
  REQUEST_INTEGRATIONS_ERROR,
  INTEGRATE_ERROR,
  INTEGRATE_ERROR_BAD_SUBSCRIBER_ORG
} from './types';

export function requestingIntegrations(subscriberOrgId) {
  return { type: REQUESTING_INTEGRATIONS, payload: { subscriberOrgId } };
}

export function receiveIntegrations(integrations) {
  return {
    type: RECEIVE_INTEGRATIONS,
    payload: integrations
  };
}

export function requestIntegrationsError(error, subscriberOrgId) {
  return { type: REQUEST_INTEGRATIONS_ERROR, meta: { subscriberOrgId }, payload: error, error: true };
}

export function requestIntegrations(subscriberOrgId) {
  const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };

  return (dispatch) => {
    dispatch(requestingIntegrations());
    return axios.get(`${config.hablaApiBaseUri}/integrations/getIntegrations?subscriberOrgId=${subscriberOrgId}`, axiosOptions)
      .then(response => response.data.integrations)
      .then(integrations => dispatch(receiveIntegrations(integrations)))
      .catch(err => dispatch(requestIntegrationsError(err, subscriberOrgId)));
  };
}


function integrate(dispatch, type, subscriberOrgId) {
  const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };

  return axios.get(`${config.hablaApiBaseUri}/integrations/${type}/integrate/${subscriberOrgId}`, axiosOptions)
    .then((response) => {
      if (response.status === 202) { // Redirect ourselves to target OAuth approval.
        window.location.href = response.data.location;
      } else if (response.status === 404) {
        dispatch({
          type: INTEGRATE_ERROR_BAD_SUBSCRIBER_ORG,
          meta: { subscriberOrgId },
          payload: new Error(`Bad subscriberOrgId: ${subscriberOrgId}`),
          error: true
        });
      } else {
        dispatch({
          type: INTEGRATE_ERROR,
          meta: {
            subscriberOrgId,
            status: response.status
          },
          payload: new Error('Server error.'),
          error: true
        });
      }
    })
    .catch((err) => {
      dispatch({
        type: INTEGRATE_ERROR,
        meta: { subscriberOrgId },
        payload: err,
        error: true
      });
    });
}

export function integrateGoogle(subscriberOrgId) {
  return (dispatch) => {
    return integrate(dispatch, 'google', subscriberOrgId);
  };
}

export function integrateBox(subscriberOrgId) {
  return (dispatch) => {
    return integrate(dispatch, 'box', subscriberOrgId);
  };
}
