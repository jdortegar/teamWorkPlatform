import config from '../config';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const TIME_ACTIVITY_FETCH_SUCCESS = 'timeactivity/fetch/success';

export const fetchTimeActivityBySubscriberOrgId = (subscriberOrgId, options = { getKey: false, forceGet: false }) => {
  const requestUrl = `${config.hablaApiBaseUri}/graphapi/ckg-timeact/${subscriberOrgId}`;

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
          console.warn('$$$$$$$$$$$$$$$$$$$$$');
          console.warn(response.data);
          console.warn('$$$$$$$$$$$$$$$$$$$$$');
          const { message } = response.data;
          dispatch({
            type: TIME_ACTIVITY_FETCH_SUCCESS,
            payload: { message }
          });
        }
        return response;
      });
    }

    return thunk;
  };
};
