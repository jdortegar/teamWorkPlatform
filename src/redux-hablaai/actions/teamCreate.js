import config from '../config';
import { doAuthenticatedRequest } from './urlRequest';

export const createTeam = (createObject, subscriberOrgId, getKey = false) => { // eslint-disable-line import/prefer-default-export
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/teams/createTeam/${subscriberOrgId}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { createObject, subscriberOrgId };

  return doAuthenticatedRequest({
    requestUrl,
    method: 'post',
    data: createObject
  }, reduxState, getKey);
};
