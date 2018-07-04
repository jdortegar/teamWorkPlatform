import config from 'config/env';
import { doAuthenticatedRequest } from './urlRequest';

export const configureIntegration = (type, subscriberOrgId, configuration) => { // eslint-disable-line import/prefer-default-export
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/integrations/${type}/configure/${subscriberOrgId}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in your mapStateToProps.
  const reduxState = { type, subscriberOrgId, configuration };

  return doAuthenticatedRequest({
    requestUrl,
    method: 'patch',
    data: configuration
  }, reduxState);
};
