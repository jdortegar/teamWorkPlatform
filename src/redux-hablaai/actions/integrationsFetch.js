import { buildApiUrl } from 'src/lib/api';
import { getCurrentSubscriberOrgId } from 'src/selectors';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const INTEGRATIONS_FETCH_SUCCESS = 'integrations/fetch/success';
export const TEAM_INTEGRATIONS_FETCH_SUCCESS = 'teamIntegrations/fetch/success';

export const fetchIntegrations = () => (dispatch, getState) => {
  const orgId = getCurrentSubscriberOrgId(getState());
  const requestUrl = buildApiUrl(`integrations/getIntegrations?subscriberOrgId=${orgId}`);
  const thunk = dispatch(
    doAuthenticatedRequest(
      {
        requestUrl,
        method: 'get'
      },
      { subscriberOrgId: orgId },
      { forceGet: true }
    )
  );

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

  return thunk;
};

export const fetchTeamIntegrations = teamId => (dispatch, getState) => {
  const orgId = getCurrentSubscriberOrgId(getState());
  const requestUrl = buildApiUrl(`organization/${orgId}/teams/${teamId}/integrations`, 'v2');

  const thunk = dispatch(doAuthenticatedRequest({ requestUrl, method: 'get' }, { teamId }, { forceGet: true }));

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

  return thunk;
};
