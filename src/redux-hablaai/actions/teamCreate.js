import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const CREATE_TEAM_STATUS_SUCCESS = 'updateUser/success';

// eslint-disable-next-line import/prefer-default-export
export const createTeam = (createObject, subscriberOrgId, options = { getKey: false, forceGet: false }) => {
  const requestUrl = buildApiUrl(`teams/createTeam/${subscriberOrgId}`);

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { createObject, subscriberOrgId };

  return dispatch => {
    const thunk = dispatch(
      doAuthenticatedRequest(
        {
          requestUrl,
          method: 'post',
          data: createObject
        },
        reduxState,
        options
      )
    );

    if (!options.getKey) {
      thunk.then(response => {
        if (response.data && response.data !== RESPONSE_STALE) {
          const teamcreated = response.data;
          dispatch({
            type: CREATE_TEAM_STATUS_SUCCESS,
            payload: { teamcreated }
          });
        }
        return response;
      });
    }

    return thunk;
  };
};
