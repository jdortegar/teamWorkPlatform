import { buildApiUrl } from 'src/lib/api';
import { sortByFirstName } from '../selectors/helpers';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const TEAMMEMBERS_FETCH_SUCCESS = 'teammembers/fetch/success';

export const fetchTeamMembers = (teamId, options = { getKey: false, forceGet: false }) => {
  const requestUrl = buildApiUrl(`teams/getMembers/${teamId}`);

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { teamId };

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
          const teamMembers = response.data.teamMembers.sort(sortByFirstName);
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
