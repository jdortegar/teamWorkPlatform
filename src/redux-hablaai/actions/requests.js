import { buildApiUrl } from 'src/lib/api';
import { getCurrentOrgId } from 'src/selectors';
import { doAuthenticatedRequest } from './urlRequest';

export const REQUEST_RESPONSE_UPDATE = 'requestResponse/update';

export const requestJoinToTeam = (teamId, userId) => (dispatch, getState) => {
  const orgId = getCurrentOrgId(getState());
  const requestUrl = buildApiUrl(`organization/${orgId}/teams/${teamId}/joinRequests/`, 'v2');

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { userId, teamId };

  return dispatch(
    doAuthenticatedRequest(
      {
        requestUrl,
        method: 'post',
        data: { userId }
      },
      reduxState
    )
  );
};

export const updateRequestResponse = () => ({
  type: REQUEST_RESPONSE_UPDATE
});
