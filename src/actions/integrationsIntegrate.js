import { doAuthenticatedRequest } from '../redux-hablaai/actions/urlRequest';
import config from '../config/env';
import {
  INTEGRATE_ERROR,
  INTEGRATE_ERROR_BAD_SUBSCRIBER_ORG
} from './types';


function integrate(type, subscriberOrgId, getKey = false) {
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/integrations/${type}/integrate/${subscriberOrgId}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { type, subscriberOrgId };

  return (dispatch) => {
    const thunk = dispatch(doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    }, reduxState, getKey));

    if (!getKey) {
      thunk.then((response) => {
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
      });
    }

    return thunk;
  };
}

export function integrateGoogle(subscriberOrgId, getKey = false) {
  return integrate('google', subscriberOrgId, getKey);
}

export function integrateBox(subscriberOrgId, getKey = false) {
  return integrate('box', subscriberOrgId, getKey);
}
