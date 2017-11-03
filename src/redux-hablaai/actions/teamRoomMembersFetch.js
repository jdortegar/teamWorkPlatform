import config from '../config';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const TEAMROOMMEMBERS_FETCH_SUCCESS = 'teamroommembers/fetch/success';

export const fetchTeamRoomMembersByTeamRoomId = (teamRoomId, getKey = false) => {
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/teamRooms/getMembers/${teamRoomId}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { teamRoomId };

  return (dispatch) => {
    const thunk = dispatch(doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    }, reduxState, getKey));

    if (!getKey) {
      thunk.then((response) => {
        if ((response.data) && (response.data !== RESPONSE_STALE)) {
          const { teamRoomMembers } = response.data;
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
