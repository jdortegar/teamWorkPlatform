import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest } from './urlRequest';

export const configureOrgIntegration = (source, subscriberOrgId, configuration) => {
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

export const configureTeamIntegration = (source, teamId, configuration) => {
  const requestUrl = buildApiUrl(`integrations/${source}/configure/${teamId}?teamLevel=1`);
  const data = { [source]: configuration };
  const reduxState = { source, teamId, data, teamLevel: true };

  return doAuthenticatedRequest(
    {
      requestUrl,
      method: 'patch',
      data
    },
    reduxState
  );
};
