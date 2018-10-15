import { buildKnowledgeApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest } from './urlRequest';

export const INTEGRATION_ERROR = 'integration/error';
export const INTEGRATION_ERROR_BADSUBSCRIBERORG = 'integration/error/badsubscriberorg';

export const INTEGRATIONS_UPDATE = 'integrations/update';
export const INTEGRATIONS_FETCH_DETAILS_SUCCESS = 'integrations/fetchDetails/success';

export const updateIntegrations = (userId, subscriberOrgId, integrations) => ({
  type: INTEGRATIONS_UPDATE,
  payload: { userId, subscriberOrgId, integrations }
});

export const fetchIntegrationDetails = (source, subscriberUserId) => {
  const requestUrl = buildKnowledgeApiUrl(`service/${source}/${subscriberUserId}`);
  const reduxState = { source, subscriberUserId };

  return dispatch => {
    const thunk = dispatch(doAuthenticatedRequest({ requestUrl, method: 'get' }, reduxState, { forceGet: true }));

    thunk
      .then(response => {
        if (response.data && response.data.body) {
          const { body: integrationDetails } = response.data;
          dispatch({
            type: INTEGRATIONS_FETCH_DETAILS_SUCCESS,
            payload: { integrationDetails }
          });
        } else {
          console.error('ERROR fetching integration details:', response.data); // eslint-disable-line no-console
        }
        return response;
      })
      .catch(error => console.error(error)); // eslint-disable-line no-console

    return thunk;
  };
};
