import config from '../config';
import { doAuthenticatedRequest } from './urlRequest';

export const updateSubscriberOrg = (updateObject, subscriberOrgId) => { // eslint-disable-line import/prefer-default-export
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/subscriberOrgs/updateSubscriberOrg/${subscriberOrgId}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { updateObject, subscriberOrgId };

  return doAuthenticatedRequest({
    requestUrl,
    method: 'patch',
    data: updateObject
  }, reduxState);
};
