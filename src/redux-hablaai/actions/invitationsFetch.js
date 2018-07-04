import config from 'config/env';
import { doAuthenticatedRequest } from './urlRequest';

export const INVITATIONS_FETCH_SUCCESS = 'invitations/fetch/success';

export const fetchInvitations = (options = { getKey: false, forceGet: false }) => {
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/users/getInvitations`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { };

  return (dispatch) => {
    const thunk = dispatch(doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    }, reduxState, options));

    thunk.then((response) => {
      const { invitations } = response.data;
      dispatch({
        type: INVITATIONS_FETCH_SUCCESS,
        payload: { invitations }
      });
      return invitations;
    });
  };
};

export const SENT_INVITATIONS_FETCH_SUCCESS = 'sentInvitations/fetch/success';

// The state of the invitation, null | ACCEPTED | DECLINED | EXPIRED, where null means pending.
export const fetchSentInvitations = (state = null, since = null, options = { getKey: false, forceGet: false }) => {
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/users/getSentInvitations`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = {};
  if (state) reduxState.state = state;
  if (since) reduxState.since = since;

  return (dispatch) => {
    const thunk = dispatch(doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    }, reduxState, options));

    thunk.then((response) => {
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
  };
};
