import { doAuthenticatedRequest } from './urlRequest';
import config from '../config';
import {
  INTEGRATION_ERROR,
  INTEGRATION_ERROR_BADSUBSCRIBERORG
} from './integrations';

export const INTEGRATIONS_REVOKE_SUCCESS = 'intgrations/revoke/success';

function revoke(type, subscriberOrgId) {
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/integrations/${type}/revoke/${subscriberOrgId}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { type, subscriberOrgId };

  return (dispatch) => {
    const thunk = dispatch(doAuthenticatedRequest({
      requestUrl,
      method: 'post'
    }, reduxState));

    thunk
      .then((response) => {
        if (response.status === 200) { // OK.
          dispatch({
            type: INTEGRATIONS_REVOKE_SUCCESS,
            payload: { type, subscriberOrgId, status: response.status, data: response.data }
          });
        }
        return response.status;
      })
      .catch((err) => {
        const { response } = err;
        if (response.status === 404) { // Not Found.
          dispatch({
            type: INTEGRATION_ERROR_BADSUBSCRIBERORG,
            meta: { type, subscriberOrgId, status: response.status, data: response.data },
            payload: new Error(`Bad subscriberOrgId: ${subscriberOrgId}`),
            error: true
          });
        } else if (response.status === 410) { // Gone.
          dispatch({
            type: INTEGRATIONS_REVOKE_SUCCESS,
            meta: { type, subscriberOrgId, status: response.status, data: response.data },
            payload: new Error('Remote revoke failed.'),
            error: true
          });
        } else {
          dispatch({
            type: INTEGRATION_ERROR,
            meta: {
              subscriberOrgId,
              status: response.status
            },
            payload: new Error('Server error.'),
            error: true
          });
        }
        return response.status;
      });

    return thunk;
  };
}

export function revokeGoogle(subscriberOrgId) {
  return revoke('google', subscriberOrgId);
}

export function revokeBox(subscriberOrgId) {
  return revoke('box', subscriberOrgId);
}
