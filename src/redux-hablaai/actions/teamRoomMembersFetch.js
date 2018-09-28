import { buildApiUrl } from 'src/lib/api';
import { sortByFirstName } from '../selectors/helpers';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const TEAMROOMMEMBERS_FETCH_SUCCESS = 'teamroommembers/fetch/success';

export const fetchTeamRoomMembersByTeamRoomId = (teamRoomId, options = { getKey: false, forceGet: false }) => {
  const requestUrl = buildApiUrl(`teamRooms/getMembers/${teamRoomId}`);

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { teamRoomId };

  return dispatch => {
    const thunk = dispatch(
      doAuthenticatedRequest(
        {
          requestUrl,
          method: 'get'
        },
        reduxState,
        options
      )
    );

    if (!options.getKey) {
      thunk.then(response => {
        if (response.data && response.data !== RESPONSE_STALE) {
          const teamRoomMembers = response.data.teamRoomMembers.sort(sortByFirstName);
          dispatch({
            type: TEAMROOMMEMBERS_FETCH_SUCCESS,
            payload: { teamRoomMembers, teamRoomId }
          });
        }
        return response;
      });
    }

    return thunk;
  };
};
