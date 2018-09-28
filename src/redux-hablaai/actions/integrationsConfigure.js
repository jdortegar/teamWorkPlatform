import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest } from './urlRequest';

// eslint-disable-next-line import/prefer-default-export
export const configureIntegration = (type, subscriberOrgId, configuration) => {
  const requestUrl = buildApiUrl(`integrations/${type}/configure/${subscriberOrgId}`);

  // Passthrough data that you'll see after going through the reducer.  Typically in your mapStateToProps.
  const reduxState = { type, subscriberOrgId, configuration };

  return doAuthenticatedRequest(
    {
      requestUrl,
      method: 'patch',
      data: configuration
    },
    reduxState
  );
};
