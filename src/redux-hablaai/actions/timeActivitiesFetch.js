import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const TIMEACTIVITIES_FETCH_SUCCESS = 'timeactivities/fetch/success';

export const fetchTimeActivitiesBySubscriberOrgId = subscriberOrgId => dispatch => {
  const requestUrl = buildApiUrl(`ckg/${subscriberOrgId}/files`, 'v2');
  const thunk = dispatch(
    doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    })
  );

  thunk.then(response => {
    if (response.data !== RESPONSE_STALE) {
      dispatch({
        type: TIMEACTIVITIES_FETCH_SUCCESS,
        payload: { files: response.data }
      });
    }
    return response;
  });

  return thunk;
};
