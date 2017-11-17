import config from '../config';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const TEAMMEMBERS_FETCH_SUCCESS = 'teammembers/fetch/success';

export const fetchTeamMembersByTeamId = (teamId, options = { getKey: false, forceGet: false }) => {
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/teams/getMembers/${teamId}`;

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
