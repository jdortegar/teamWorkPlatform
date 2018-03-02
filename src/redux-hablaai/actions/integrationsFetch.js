import config from '../config';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const INTEGRATIONS_FETCH_SUCCESS = 'integrations/fetch/success';

export const fetchIntegrations = (subscriberOrgId, options = { getKey: false, forceGet: true }) => {
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/integrations/getIntegrations?subscriberOrgId=${subscriberOrgId}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { subscriberOrgId };

  return (dispatch) => {
    const thunk = dispatch(doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    }, reduxState, options));

    if (!options.getKey) {
      thunk.then((response) => {
        if ((response.data) && (response.data !== RESPONSE_STALE)) {
          const { integrations } = response.data;
          dispatch({
            type: INTEGRATIONS_FETCH_SUCCESS,
            payload: { integrations }
          });
        }
        return response;
      });
    }

    return thunk;
  };
};
