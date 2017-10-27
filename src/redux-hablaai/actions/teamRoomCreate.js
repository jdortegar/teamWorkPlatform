import config from '../config';
import { doAuthenticatedRequest } from './urlRequest';

export const createTeamRoom = (createObject, teamId, getKey = false) => { // eslint-disable-line import/prefer-default-export
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/teamRooms/createTeamRoom/${teamId}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { createObject, teamId };

  return doAuthenticatedRequest({
    requestUrl,
    method: 'post',
    data: createObject
  }, reduxState, getKey);
};
