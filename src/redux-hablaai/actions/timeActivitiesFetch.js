import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const TIMEACTIVITIES_FETCH_SUCCESS = 'timeactivities/fetch/success';

export const fetchTimeActivitiesBySubscriberOrgId = (subscriberOrgId, options = { getKey: false, forceGet: false }) => {
  const requestUrl = `https://graphapi.habla.ai/beta2/graphapi/ckg-timeact/${subscriberOrgId}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { subscriberOrgId };

  return (dispatch) => {
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
      thunk.then((response) => {
        if (response.data && response.data !== RESPONSE_STALE) {
          const { message } = response.data;
          dispatch({
            type: TIMEACTIVITIES_FETCH_SUCCESS,
            payload: { message }
          });
        }
        return response;
      });
    }

    return thunk;
  };
};
