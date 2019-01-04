import { buildApiUrl } from 'src/lib/api';
import { getCurrentSubscriberOrgId, getCurrentSubscriberUserId } from 'src/selectors';
import { doAuthenticatedRequest } from './urlRequest';
import { INTEGRATION_ERROR, INTEGRATION_ERROR_NOT_FOUND } from './integrations';

export const INTEGRATIONS_REVOKE_SUCCESS = 'integrations/revoke/success';
export const TEAM_INTEGRATIONS_REVOKE_SUCCESS = 'teamIntegrations/revoke/success';

const teamRevokeSuccess = ({ source, teamId, userId, response }) => ({
  type: TEAM_INTEGRATIONS_REVOKE_SUCCESS,
  payload: { source, teamId, userId, status: response.status, data: response.data }
});

const orgRevokeSuccess = ({ source, orgId, subscriberUserId, response }) => ({
  type: INTEGRATIONS_REVOKE_SUCCESS,
  payload: { source, orgId, subscriberUserId, status: response.status, data: response.data }
});

const revokeSuccess = teamLevel => (teamLevel ? teamRevokeSuccess : orgRevokeSuccess);

const revoke = (requestUrl, params = { teamLevel: false }) => dispatch => {
  const thunk = dispatch(
    doAuthenticatedRequest(
      {
        requestUrl,
        method: 'post'
      },
      params
    )
  );

  thunk
    .then(response => {
      if (response.status === 200) {
        dispatch(revokeSuccess(params.teamLevel)({ ...params, response }));
      }
      return response.status;
    })
    .catch(err => {
      const { response } = err;
      const meta = { ...params, status: response.status, data: response.data };
      if (response.status === 404) {
        // Not Found.
        dispatch({
          type: INTEGRATION_ERROR_NOT_FOUND,
          meta,
          payload: new Error(params.teamLevel ? `Bad orgId: ${params.orgId}` : `Bad teamId: ${params.teamId}`),
          error: true
        });
      } else if (response.status === 410) {
        // Gone.
        dispatch({
          type: INTEGRATIONS_REVOKE_SUCCESS,
          meta,
          payload: new Error('Remote revoke failed.'),
          error: true
        });
      } else {
        dispatch({
          type: INTEGRATION_ERROR,
          meta,
          payload: new Error('Server error.'),
          error: true
        });
      }
      return response.status;
    });

  return thunk;
};

export const revokeOrgIntegration = source => (dispatch, getState) => {
  const state = getState();
  const orgId = getCurrentSubscriberOrgId(state);
  const subscriberUserId = getCurrentSubscriberUserId(state);
  const requestUrl = buildApiUrl(`integrations/${source}/revoke/${orgId}`);

  return revoke(requestUrl, { source, orgId, subscriberUserId })(dispatch);
};

export const revokeTeamIntegration = (source, teamId, userId) => dispatch => {
  const requestUrl = buildApiUrl(`integrations/${source}/revoke/${teamId}?teamLevel=1&userId=${userId}`);
  return revoke(requestUrl, { source, teamId, userId, teamLevel: true })(dispatch);
};
