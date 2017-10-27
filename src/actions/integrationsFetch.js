import config from '../config/env';
import { doAuthenticatedRequest } from '../redux-hablaai/actions/urlRequest';

export const INTEGRATIONS_FETCH_SUCCESS = 'integrations/fetch/success';

export const fetchIntegrations = (subscriberOrgId, getKey) => {
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/integrations/getIntegrations?subscriberOrgId=${subscriberOrgId}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { subscriberOrgId };

  return (dispatch) => {
    const thunk = dispatch(doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    }, reduxState, getKey));

    if (!getKey) {
      thunk.then((response) => {
        if (response.data) {
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
