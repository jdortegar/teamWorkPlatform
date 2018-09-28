import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest } from './urlRequest';

// eslint-disable-next-line import/prefer-default-export
export const createSubscriberOrg = createObject => {
  const requestUrl = buildApiUrl(`subscriberOrgs/createSubscriberOrg`);

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { createObject };

  return doAuthenticatedRequest(
    {
      requestUrl,
      method: 'post',
      data: createObject
    },
    reduxState
  );
};
