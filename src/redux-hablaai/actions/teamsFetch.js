import config from '../config';
import { doAuthenticatedRequest } from './urlRequest';

export const TEAMS_FETCH_SUCCESS = 'teams/fetch/success';

export const fetchTeamsBySubscriberOrgId = (subscriberOrgId, getKey = false) => {
  // requestUrl is the key into redux state.urlRequests.
  let requestUrl = `${config.hablaApiBaseUri}/teams/getTeams`;
  requestUrl = (typeof subscriberOrgId === 'string') ? `${requestUrl}?subscriberOrgId=${subscriberOrgId}` : requestUrl;

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
          const { teams } = response.data;
          dispatch({
            type: TEAMS_FETCH_SUCCESS,
            payload: { teams }
          });
        }
        return response;
      });
    }

    return thunk;
  };
};

export const fetchTeams = (getKey = false) => {
  return fetchTeamsBySubscriberOrgId(undefined, getKey);
};
