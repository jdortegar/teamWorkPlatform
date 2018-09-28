import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest } from './urlRequest';

// eslint-disable-next-line import/prefer-default-export
export const updateTeamRoom = (updateObject, teamRoomId) => {
  const requestUrl = buildApiUrl(`teamRooms/updateTeamRoom/${teamRoomId}`);

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
