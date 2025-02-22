import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest } from './urlRequest';

// eslint-disable-next-line import/prefer-default-export
export const updateSubscriberOrg = (updateObject, subscriberOrgId) => {
  const requestUrl = buildApiUrl(`subscriberOrgs/updateSubscriberOrg/${subscriberOrgId}`);

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { updateObject, subscriberOrgId };

  return doAuthenticatedRequest(
    {
      requestUrl,
      method: 'patch',
      data: updateObject
    },
    reduxState
  );
};
