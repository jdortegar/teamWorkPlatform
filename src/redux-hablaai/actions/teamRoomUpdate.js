import config from '../config';
import { doAuthenticatedRequest } from './urlRequest';

export const updateTeamRoom = (updateObject, teamRoomId, getKey) => { // eslint-disable-line import/prefer-default-export
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/teamRooms/updateTeamRoom/${teamRoomId}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { updateObject, teamRoomId };

  return dispatch => dispatch(doAuthenticatedRequest({
    requestUrl,
    method: 'patch',
    data: updateObject
  }, reduxState, getKey));
};
