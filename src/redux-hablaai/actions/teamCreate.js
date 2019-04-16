import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const CREATE_TEAM_SUCCESS = 'createTeam/success';

// eslint-disable-next-line import/prefer-default-export
export const createTeam = (createObject, subscriberOrgId) => dispatch => {
  const requestUrl = buildApiUrl(`teams/createTeam/${subscriberOrgId}`);
  const thunk = dispatch(
    doAuthenticatedRequest(
      {
        requestUrl,
        method: 'post',
        data: createObject
      },
      { createObject, subscriberOrgId }
    )
  );

  thunk.then(response => {
    if (response.data && response.data !== RESPONSE_STALE) {
      const team = response.data;

      dispatch({
        type: CREATE_TEAM_SUCCESS,
        payload: { team }
      });
    }
    return response;
  });

  return thunk;
};
