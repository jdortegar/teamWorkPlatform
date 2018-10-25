import { buildKnowledgeApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest } from './urlRequest';

export const INTEGRATION_ERROR = 'integration/error';
export const INTEGRATION_ERROR_BADSUBSCRIBERORG = 'integration/error/badsubscriberorg';

export const INTEGRATIONS_UPDATE = 'integrations/update';
export const INTEGRATIONS_FETCH_CONTENT_REQUEST = 'integrations/fetchContent/request';
export const INTEGRATIONS_FETCH_CONTENT_SUCCESS = 'integrations/fetchContent/success';
export const INTEGRATIONS_FETCH_CONTENT_FAILURE = 'integrations/fetchContent/failure';

export const updateIntegrations = (userId, subscriberOrgId, integrations) => ({
  type: INTEGRATIONS_UPDATE,
  payload: { userId, subscriberOrgId, integrations }
});

export const fetchIntegrationContent = (source, subscriberUserId) => dispatch => {
  const requestUrl = buildKnowledgeApiUrl(`service/${source}/${subscriberUserId}`);
  const thunk = dispatch(
    doAuthenticatedRequest({ requestUrl, method: 'get' }, { source, subscriberUserId }, { forceGet: true })
  );

  dispatch({ type: INTEGRATIONS_FETCH_CONTENT_REQUEST });

  thunk
    .then(response => {
      if (response.data && response.data.body) {
        const { body: content } = response.data;
        dispatch({
          type: INTEGRATIONS_FETCH_CONTENT_SUCCESS,
          payload: { content }
        });
      } else {
        dispatch({ type: INTEGRATIONS_FETCH_CONTENT_FAILURE, payload: { error: response.data } });
      }
      return response;
    })
    .catch(error => dispatch({ type: INTEGRATIONS_FETCH_CONTENT_FAILURE, payload: { error } }));

  return thunk;
};
