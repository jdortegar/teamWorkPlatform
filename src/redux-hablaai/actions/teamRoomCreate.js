import config from 'config/env';
import { doAuthenticatedRequest } from './urlRequest';

// eslint-disable-next-line import/prefer-default-export
export const createTeamRoom = (createObject, teamId) => {
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/teamRooms/createTeamRoom/${teamId}`;

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
