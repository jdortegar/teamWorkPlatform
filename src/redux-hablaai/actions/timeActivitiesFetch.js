import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const TIMEACTIVITIES_FETCH_SUCCESS = 'timeactivities/fetch/success';

export const fetchTimeActivitiesBySubscriberOrgId = (subscriberOrgId, options = { getKey: false, forceGet: true }) => {
  const requestUrl = buildApiUrl(`ckg/${subscriberOrgId}/files`, 'v2');

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
        if (response.data !== RESPONSE_STALE) {
          dispatch({
            type: TIMEACTIVITIES_FETCH_SUCCESS,
            payload: { files: response.data }
          });
        }
        return response;
      });
    }

    return thunk;
  };
};
