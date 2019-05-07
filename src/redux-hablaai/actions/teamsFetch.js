import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const TEAMS_FETCH_SUCCESS = 'teams/fetch/success';
export const PUBLIC_TEAMS_FETCH_SUCCESS = 'teams/public/fetch/success';

export const fetchTeamsBySubscriberOrgId = subscriberOrgId => dispatch => {
  let requestUrl = buildApiUrl('teams/getTeams');
  requestUrl = subscriberOrgId ? `${requestUrl}?subscriberOrgId=${subscriberOrgId}` : requestUrl;

  const thunk = dispatch(
    doAuthenticatedRequest(
      {
        requestUrl,
        method: 'get'
      },
      { subscriberOrgId }
    )
  );

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

  return thunk;
};

export const fetchTeams = () => fetchTeamsBySubscriberOrgId();

export const fetchPublicTeamsBySubscriberOrgId = subscriberOrgId => dispatch => {
  const requestUrl = buildApiUrl(`organization/${subscriberOrgId}/teams/public`, 'v2');

  const thunk = dispatch(
    doAuthenticatedRequest(
      {
        requestUrl,
        method: 'get'
      },
      { subscriberOrgId }
    )
  );

  thunk.then(response => {
    if (response.data && response.data !== RESPONSE_STALE) {
      const { teams } = response.data;
      dispatch({
        type: PUBLIC_TEAMS_FETCH_SUCCESS,
        payload: { subscriberOrgId, teams }
      });
    }
    return response;
  });

  return thunk;
};

export const fetchPublicTeams = orgId => fetchPublicTeamsBySubscriberOrgId(orgId);
