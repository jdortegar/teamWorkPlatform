import { buildApiUrl } from 'src/lib/api';
import { getCurrentOrgId } from 'src/selectors';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const FILES_FETCH_REQUEST = 'files/fetch/request';
export const FILES_FETCH_SUCCESS = 'files/fetch/success';
export const FILES_FETCH_FAILURE = 'files/fetch/failure';
export const FILES_FETCH_STALE = 'files/fetch/stale';

export const fetchTeamFiles = teamId => (dispatch, getState) => {
  const orgId = getCurrentOrgId(getState());
  const requestUrl = buildApiUrl(`ckg/${orgId}/teams/${teamId}/files`, 'v2');

  const thunk = dispatch(
    doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    })
  );

  dispatch({
    type: FILES_FETCH_REQUEST,
    payload: { teamId }
  });

  thunk.then(
    response => {
      if (response.data !== RESPONSE_STALE) {
        dispatch({
          type: FILES_FETCH_SUCCESS,
          payload: { files: response.data, teamId }
        });
      }
      if (response.data === RESPONSE_STALE) {
        dispatch({ type: FILES_FETCH_STALE });
      }
      return response;
    },
    error => {
      dispatch({ type: FILES_FETCH_FAILURE, teamId });
      return error;
    }
  );

  return thunk;
};
