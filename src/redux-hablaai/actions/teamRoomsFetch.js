import config from '../config';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const TEAMROOMS_FETCH_SUCCESS = 'teamrooms/fetch/success';

export const fetchTeamRoomsByTeamId = (teamId, options = { getKey: false, forceGet: false }) => {
  // requestUrl is the key into redux state.urlRequests.
  let requestUrl = `${config.hablaApiBaseUri}/teamRooms/getTeamRooms`;
  requestUrl = (teamId) ? `${requestUrl}?teamId=${teamId}` : requestUrl;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { teamId };

  return (dispatch) => {
    const thunk = dispatch(doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    }, reduxState, options));

    if (!options.getKey) {
      thunk.then((response) => {
        if ((response.data) && (response.data !== RESPONSE_STALE)) {
          const { teamRooms } = response.data;
          dispatch({
            type: TEAMROOMS_FETCH_SUCCESS,
            payload: { teamId, teamRooms }
          });
        }
        return response;
      });
    }

    return thunk;
  };
};

export const fetchTeamRooms = (options = { getKey: false, forceGet: false }) => {
  return fetchTeamRoomsByTeamId(undefined, options);
};
