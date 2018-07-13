import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';
import config from '../../config/env';

export const TIMEACTIVITIES_FETCH_SUCCESS = 'timeactivities/fetch/success';

export const fetchTimeActivitiesBySubscriberOrgId = (subscriberOrgId, options = { getKey: false, forceGet: true }) => {
  const requestUrl = `${config.hablaApiBaseUri}/ckg/getFiles/${subscriberOrgId}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { subscriberOrgId };

  return dispatch => {
    const thunk = dispatch(
      doAuthenticatedRequest(
        {
          requestUrl,
          method: 'get'
        },
        reduxState,
        options
      )
    );

    if (!options.getKey) {
      thunk.then(response => {
        if (response.data && response.data !== RESPONSE_STALE) {
          const { edges, files } = response.data.message;
          dispatch({
            type: TIMEACTIVITIES_FETCH_SUCCESS,
            payload: { edges, files }
          });
        }
        return response;
      });
    }

    return thunk;
  };
};
