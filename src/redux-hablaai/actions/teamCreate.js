import config from 'src/config/env';
import { doAuthenticatedRequest } from './urlRequest';

// eslint-disable-next-line import/prefer-default-export
export const createTeam = (createObject, subscriberOrgId) => {
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/teams/createTeam/${subscriberOrgId}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { createObject, subscriberOrgId };

  return doAuthenticatedRequest(
    {
      requestUrl,
      method: 'post',
      data: createObject
    },
    reduxState
  );
};
