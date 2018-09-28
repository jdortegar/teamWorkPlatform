import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest } from './urlRequest';

// eslint-disable-next-line import/prefer-default-export
export const createTeamRoom = (createObject, teamId) => {
  const requestUrl = buildApiUrl(`teamRooms/createTeamRoom/${teamId}`);

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { createObject, teamId };

  return doAuthenticatedRequest(
    {
      requestUrl,
      method: 'post',
      data: createObject
    },
    reduxState
  );
};
