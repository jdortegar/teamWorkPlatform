import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const INTEGRATIONS_FETCH_SUCCESS = 'integrations/fetch/success';
export const TEAM_INTEGRATIONS_FETCH_SUCCESS = 'teamIntegrations/fetch/success';

export const fetchIntegrations = (subscriberOrgId, options = { getKey: false, forceGet: true }) => {
  const requestUrl = buildApiUrl(`integrations/getIntegrations?subscriberOrgId=${subscriberOrgId}`);

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

export const fetchTeamIntegrations = (subscriberOrgId, teamId, options = { getKey: false, forceGet: true }) => {
  const requestUrl = buildApiUrl(`organization/${subscriberOrgId}/teams/${teamId}/integrations`, 'v2');

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { teamId };

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
          const { teamMemberIntegrations } = response.data;
          dispatch({
            type: TEAM_INTEGRATIONS_FETCH_SUCCESS,
            payload: { teamMemberIntegrations }
          });
        }
        return response;
      });
    }

    return thunk;
  };
};
