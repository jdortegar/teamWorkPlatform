import config from '../config';
import { doAuthenticatedRequest } from './urlRequest';

export const TEAMROOMS_FETCH_SUCCESS = 'teamrooms/fetch/success';

export const fetchTeamRoomsByTeamId = (teamId, getKey = false) => {
  // requestUrl is the key into redux state.urlRequests.
  let requestUrl = `${config.hablaApiBaseUri}/teamRooms/getTeamRooms`;
  requestUrl = (teamId) ? `${requestUrl}?teamId=${teamId}` : requestUrl;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { teamId };

  return (dispatch) => {
    const thunk = dispatch(doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    }, reduxState, getKey));

    if (!getKey) {
      thunk.then((response) => {
        if (response.data) {
          const { teamRooms } = response.data;
          dispatch({
            type: TEAMROOMS_FETCH_SUCCESS,
            payload: { teamRooms }
          });
        }
        return response;
      });
    }

    return thunk;
  };
};

export const fetchTeamRooms = (getKey = false) => {
  return fetchTeamRoomsByTeamId(undefined, getKey);
};
