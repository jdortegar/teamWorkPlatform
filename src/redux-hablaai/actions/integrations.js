import { buildKnowledgeApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest } from './urlRequest';

export const INTEGRATION_ERROR = 'integration/error';
export const INTEGRATION_ERROR_NOT_FOUND = 'integration/error/notFound';

export const INTEGRATIONS_UPDATE = 'integrations/update';
export const INTEGRATIONS_CONTENT_FETCH_REQUEST = 'integrations/fetchContent/request';
export const INTEGRATIONS_CONTENT_FETCH_SUCCESS = 'integrations/fetchContent/success';
export const INTEGRATIONS_CONTENT_FETCH_FAILURE = 'integrations/fetchContent/failure';

export const updateIntegrations = (userId, subscriberOrgId, integrations) => ({
  type: INTEGRATIONS_UPDATE,
  payload: { userId, subscriberOrgId, integrations }
});

export const fetchIntegrationContent = (source, subscriberUserId, teamId) => dispatch => {
  const teamParam = teamId ? `/${teamId}` : '';
  const requestUrl = buildKnowledgeApiUrl(`service/${source}/${subscriberUserId}${teamParam}`);

  dispatch({ type: INTEGRATIONS_CONTENT_FETCH_REQUEST, payload: { source, subscriberUserId, teamId } });

  const thunk = dispatch(
    doAuthenticatedRequest({ requestUrl, method: 'get' }, { source, subscriberUserId, teamId }, { forceGet: true })
  );

  thunk
    .then(response => {
      if (response.data && response.data.body) {
        const { body: content } = response.data;
        dispatch({
          type: INTEGRATIONS_CONTENT_FETCH_SUCCESS,
          payload: { content, source, subscriberUserId, teamId }
        });
      } else {
        dispatch({
          type: INTEGRATIONS_CONTENT_FETCH_FAILURE,
          payload: { error: response.data, source, subscriberUserId, teamId }
        });
      }
      return response;
    })
    .catch(error =>
      dispatch({ type: INTEGRATIONS_CONTENT_FETCH_FAILURE, payload: { error, source, subscriberUserId, teamId } })
    );

  return thunk;
};
