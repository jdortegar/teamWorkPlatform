import config from 'src/config/env';
import { doAuthenticatedRequest } from './urlRequest';

// eslint-disable-next-line import/prefer-default-export
export const updateTeamRoom = (updateObject, teamRoomId) => {
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/teamRooms/updateTeamRoom/${teamRoomId}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { updateObject, teamRoomId };

  return doAuthenticatedRequest(
    {
      requestUrl,
      method: 'patch',
      data: updateObject
    },
    reduxState
  );
};
