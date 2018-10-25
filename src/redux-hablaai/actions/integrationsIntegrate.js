import { buildApiUrl } from 'src/lib/api';
import { getCurrentSubscriberOrgId } from 'src/selectors';
import { doAuthenticatedRequest } from './urlRequest';
import { INTEGRATION_ERROR, INTEGRATION_ERROR_BADSUBSCRIBERORG } from './integrations';

const integrate = (type, teamId, params = undefined) => (dispatch, getState) => {
  const orgId = getCurrentSubscriberOrgId(getState());
  let requestUrl = buildApiUrl(`integrations/${type}/integrate/${orgId}`);

  if (params) {
    const paramsString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
    requestUrl += `?${paramsString}`;
  }

  const thunk = dispatch(
    doAuthenticatedRequest(
      {
        requestUrl,
        method: 'get'
      },
      { type, subscriberOrgId: orgId },
      { forceGet: true }
    )
  );

  thunk.then(response => {
    if (response.status === 202) {
      // Redirect ourselves to target OAuth approval.
      window.location.href = response.data.location;
    } else if (response.status === 404) {
      dispatch({
        type: INTEGRATION_ERROR_BADSUBSCRIBERORG,
        meta: { subscriberOrgId: orgId },
        payload: new Error(`Bad subscriberOrgId: ${orgId}`),
        error: true
      });
    } else {
      dispatch({
        type: INTEGRATION_ERROR,
        meta: {
          subscriberOrgId: orgId,
          status: response.status
        },
        payload: new Error('Server error.'),
        error: true
      });
    }
  });

  return thunk;
};

export const integrateOrgIntegration = (type, params) => integrate(type, undefined, params);
export const integrateTeamIntegration = (type, teamId, params) => integrate(type, teamId, params);
