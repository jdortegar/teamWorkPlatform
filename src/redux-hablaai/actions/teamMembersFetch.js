import { buildApiUrl } from 'src/lib/api';
import { getCurrentOrgId } from 'src/selectors';
import { sortByFirstName } from '../selectors/helpers';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const TEAMMEMBERS_FETCH_SUCCESS = 'teammembers/fetch/success';
export const TEAMMEMBERS_PUBLIC_FETCH_SUCCESS = 'teammembers/public/fetch/success';

export const fetchTeamMembers = teamId => dispatch => {
  const requestUrl = buildApiUrl(`teams/getMembers/${teamId}`);
  const thunk = dispatch(
    doAuthenticatedRequest(
      {
        requestUrl,
        method: 'get'
      },
      { teamId }
    )
  );

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

  return thunk;
};

export const fetchPublicTeamMembers = teamId => (dispatch, getState) => {
  const orgId = getCurrentOrgId(getState());
  const requestUrl = buildApiUrl(`organization/${orgId}/teams/public/${teamId}/users`, 'v2');
  const thunk = dispatch(
    doAuthenticatedRequest(
      {
        requestUrl,
        method: 'get'
      },
      { teamId }
    )
  );

  thunk.then(response => {
    if (response.data && response.data !== RESPONSE_STALE) {
      const teamMembers = response.data.teamMembers.sort(sortByFirstName);
      dispatch({
        type: TEAMMEMBERS_PUBLIC_FETCH_SUCCESS,
        payload: { teamMembers, teamId }
      });
    }
    return response;
  });

  return thunk;
};
