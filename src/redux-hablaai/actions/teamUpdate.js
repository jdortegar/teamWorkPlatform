import config from '../config';
import { doAuthenticatedRequest } from './urlRequest';

export const updateTeam = (updateObject, teamId, getKey = false) => { // eslint-disable-line import/prefer-default-export
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/teams/updateTeam/${teamId}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { updateObject, teamId };

  return doAuthenticatedRequest({
    requestUrl,
    method: 'patch',
    data: updateObject
  }, reduxState, getKey);
};

