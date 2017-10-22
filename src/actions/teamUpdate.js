import config from '../config/env';
import { doAuthenticatedRequest } from './urlRequest';

export const updateTeam = (updateObject, teamId, getKey) => { // eslint-disable-line import/prefer-default-export
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/teams/updateTeam/${teamId}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { updateObject, teamId };

  return dispatch => dispatch(doAuthenticatedRequest({
    requestUrl,
    method: 'patch',
    data: updateObject
  }, reduxState, getKey));
};
