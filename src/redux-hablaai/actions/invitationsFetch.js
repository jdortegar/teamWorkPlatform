import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest } from './urlRequest';

export const INVITATIONS_FETCH_SUCCESS = 'invitations/fetch/success';

export const fetchInvitations = () => dispatch => {
  const requestUrl = buildApiUrl('users/getInvitations');
  const thunk = dispatch(
    doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    })
  );

  thunk.then(response => {
    const { invitations } = response.data;
    dispatch({
      type: INVITATIONS_FETCH_SUCCESS,
      payload: { invitations }
    });
    return invitations;
  });

  return thunk;
};

export const SENT_INVITATIONS_FETCH_SUCCESS = 'sentInvitations/fetch/success';

// The state of the invitation, null | ACCEPTED | DECLINED | EXPIRED, where null means pending.
export const fetchSentInvitations = (state = null, since = null) => {
  const requestUrl = buildApiUrl('users/getSentInvitations');

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = {};
  if (state) reduxState.state = state;
  if (since) reduxState.since = since;

  return dispatch => {
    const thunk = dispatch(
      doAuthenticatedRequest(
        {
          requestUrl,
          method: 'get'
        },
        reduxState
      )
    );

    thunk.then(response => {
      const { invitations } = response.data;
      if (invitations) {
        const nonAcceptedInvitations = invitations.filter(inv => inv.state !== 'ACCEPTED');
        dispatch({
          type: SENT_INVITATIONS_FETCH_SUCCESS,
          payload: { state: state || 'PENDING', sentInvitations: nonAcceptedInvitations }
        });
      }
      return invitations;
    });

    return thunk;
  };
};
