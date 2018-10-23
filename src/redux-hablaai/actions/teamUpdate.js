import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const UPDATED_TEAM_SUCCESS = 'updateTeam/success';
export const UPDATED_TEAM_MEMBER_SUCCESS = 'updateTeamMember/success';

export const updateTeam = (orgId, teamId, updateObject, options = { getKey: false, forceGet: false }) => {
  const requestUrl = buildApiUrl(`organization/${orgId}/teams/${teamId}`, 'v2');

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = {};

  return dispatch => {
    const thunk = dispatch(
      doAuthenticatedRequest(
        {
          requestUrl,
          method: 'patch',
          data: updateObject
        },
        reduxState,
        options
      )
    );

    if (!options.getKey) {
      thunk.then(response => {
        if (response.data && response.data !== RESPONSE_STALE) {
          const teamUpdated = response.data;
          dispatch({
            type: UPDATED_TEAM_SUCCESS,
            payload: { teamUpdated }
          });
        }
        return response;
      });
    }

    return thunk;
  };
};

export const updateTeamMember = (orgId, teamId, userId, updateObject, options = { getKey: false, forceGet: false }) => {
  const requestUrl = buildApiUrl(`organization/${orgId}/teams/${teamId}/users/${userId}`, 'v2');

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = {};

  return dispatch => {
    const thunk = dispatch(
      doAuthenticatedRequest(
        {
          requestUrl,
          method: 'patch',
          data: updateObject
        },
        reduxState,
        options
      )
    );

    if (!options.getKey) {
      thunk.then(response => {
        if (response.data && response.data !== RESPONSE_STALE) {
          const teamMemberUpdated = response.data;
          dispatch({
            type: UPDATED_TEAM_MEMBER_SUCCESS,
            payload: { teamMemberUpdated }
          });
        }
        return response;
      });
    }

    return thunk;
  };
};
