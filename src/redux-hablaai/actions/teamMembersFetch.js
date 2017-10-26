import config from '../config';
import { doAuthenticatedRequest } from './urlRequest';

export const TEAMMEMBERS_FETCH_SUCCESS = 'teammembers/fetch/success';

export const fetchTeamMembersByTeamId = (teamId, getKey) => {
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/team/getMembers/${teamId}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = {};

  return (dispatch) => {
    const thunk = dispatch(doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    }, reduxState, getKey));

    if (!getKey) {
      thunk.then((response) => {
        if (response.data) {
          const { teamMembers } = response.data;
          dispatch({
            type: TEAMMEMBERS_FETCH_SUCCESS,
            payload: { teamMembers, teamId }
          });
        }
        return response;
      });
    }

    return thunk;
  };
};
