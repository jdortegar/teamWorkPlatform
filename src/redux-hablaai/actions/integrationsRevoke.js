import { buildApiUrl } from 'src/lib/api';
import { getCurrentSubscriberOrgId } from 'src/selectors';
import { doAuthenticatedRequest } from './urlRequest';
import { INTEGRATION_ERROR, INTEGRATION_ERROR_BADSUBSCRIBERORG } from './integrations';

export const INTEGRATIONS_REVOKE_SUCCESS = 'integrations/revoke/success';

export const revokeIntegration = type => (dispatch, getState) => {
  const orgId = getCurrentSubscriberOrgId(getState());
  const requestUrl = buildApiUrl(`integrations/${type}/revoke/${orgId}`);

  const thunk = dispatch(
    doAuthenticatedRequest(
      {
        requestUrl,
        method: 'post'
      },
      { type, subscriberOrgId: orgId }
    )
  );

  thunk
    .then(response => {
      if (response.status === 200) {
        // OK.
        dispatch({
          type: INTEGRATIONS_REVOKE_SUCCESS,
          payload: { type, subscriberOrgId: orgId, status: response.status, data: response.data }
        });
      }
      return response.status;
    })
    .catch(err => {
      const { response } = err;
      if (response.status === 404) {
        // Not Found.
        dispatch({
          type: INTEGRATION_ERROR_BADSUBSCRIBERORG,
          meta: { type, subscriberOrgId: orgId, status: response.status, data: response.data },
          payload: new Error(`Bad subscriberOrgId: ${orgId}`),
          error: true
        });
      } else if (response.status === 410) {
        // Gone.
        dispatch({
          type: INTEGRATIONS_REVOKE_SUCCESS,
          meta: { type, subscriberOrgId: orgId, status: response.status, data: response.data },
          payload: new Error('Remote revoke failed.'),
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
      return response.status;
    });

  return thunk;
};
