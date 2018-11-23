import queryString from 'querystring';
import { buildApiUrl } from 'src/lib/api';
import { getCurrentSubscriberOrgId } from 'src/selectors';
import { doAuthenticatedRequest } from './urlRequest';
import { INTEGRATION_ERROR, INTEGRATION_ERROR_NOT_FOUND } from './integrations';

const integrate = (requestUrl, { source, orgId, teamId, teamLevel = false }) => dispatch => {
  const thunk = dispatch(
    doAuthenticatedRequest(
      {
        requestUrl,
        method: 'get'
      },
      { source, orgId, teamId, teamLevel },
      { forceGet: true }
    )
  );

  thunk.then(response => {
    const meta = { source, orgId, teamId, teamLevel, status: response.status };

    if (response.status === 202) {
      // Redirect ourselves to target OAuth approval.
      window.location.href = response.data.location;
    } else if (response.status === 404) {
      dispatch({
        type: INTEGRATION_ERROR_NOT_FOUND,
        meta,
        payload: new Error(teamLevel ? `Bad orgId: ${orgId}` : `Bad teamId: ${teamId}`),
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
  });

  return thunk;
};

export const integrateOrgIntegration = (source, params) => (dispatch, getState) => {
  const orgId = getCurrentSubscriberOrgId(getState());
  let requestUrl = buildApiUrl(`integrations/${source}/integrate/${orgId}`);
  if (params) requestUrl += `?${queryString.stringify(params)}`;

  return integrate(requestUrl, { source, orgId, params })(dispatch);
};

export const integrateTeamIntegration = (source, teamId, params) => dispatch => {
  let requestUrl = buildApiUrl(`integrations/${source}/integrate/${teamId}?teamLevel=1`);
  if (params) requestUrl += `&${queryString.stringify(params)}`;

  return integrate(requestUrl, { source, teamId, params, teamLevel: true })(dispatch);
};
