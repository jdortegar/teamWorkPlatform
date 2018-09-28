import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const TEAMS_FETCH_SUCCESS = 'teams/fetch/success';

export const fetchTeamsBySubscriberOrgId = (subscriberOrgId, options = { getKey: false, forceGet: false }) => {
  let requestUrl = buildApiUrl('teams/getTeams');
  requestUrl = subscriberOrgId ? `${requestUrl}?subscriberOrgId=${subscriberOrgId}` : requestUrl;

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
          const { teams } = response.data;
          dispatch({
            type: TEAMS_FETCH_SUCCESS,
            payload: { subscriberOrgId, teams }
          });
        }
        return response;
      });
    }

    return thunk;
  };
};

export const fetchTeams = (options = { getKey: false, forceGet: false }) =>
  fetchTeamsBySubscriberOrgId(undefined, options);
