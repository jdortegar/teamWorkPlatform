import { doAuthenticatedRequest } from './urlRequest';
import config from '../config';
import {
  INTEGRATION_ERROR,
  INTEGRATION_ERROR_BADSUBSCRIBERORG
} from './integrations';

const integrate = (type, subscriberOrgId, options = { getKey: false }) => {
  const newOptions = {
    getKey: options.getKey,
    forceGet: true
  };
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/integrations/${type}/integrate/${subscriberOrgId}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { type, subscriberOrgId };

  return (dispatch) => {
    const thunk = dispatch(doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    }, reduxState, newOptions));

    if (!newOptions.getKey) {
      thunk.then((response) => {
        if (response.status === 202) { // Redirect ourselves to target OAuth approval.
          window.location.href = response.data.location;
        } else if (response.status === 404) {
          dispatch({
            type: INTEGRATION_ERROR_BADSUBSCRIBERORG,
            meta: { subscriberOrgId },
            payload: new Error(`Bad subscriberOrgId: ${subscriberOrgId}`),
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
      });
    }

    return thunk;
  };
};

export const integrateGoogle = (subscriberOrgId, newOptions = { getKey: false }) => {
  return integrate('google', subscriberOrgId, newOptions);
};

export const integrateBox = (subscriberOrgId, newOptions = { getKey: false }) => {
  return integrate('box', subscriberOrgId, newOptions);
};
