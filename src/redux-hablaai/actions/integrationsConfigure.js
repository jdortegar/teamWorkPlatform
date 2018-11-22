import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest } from './urlRequest';

// eslint-disable-next-line import/prefer-default-export
export const configureIntegration = (source, subscriberOrgId, configuration) => {
  const requestUrl = buildApiUrl(`integrations/${source}/configure/${subscriberOrgId}`);
  const data = { [source]: configuration };
  const reduxState = { source, subscriberOrgId, data };

  return doAuthenticatedRequest(
    {
      requestUrl,
      method: 'patch',
      data
    },
    reduxState
  );
};
