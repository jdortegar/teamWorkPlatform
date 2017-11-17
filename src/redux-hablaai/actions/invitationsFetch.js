import config from '../config';
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
