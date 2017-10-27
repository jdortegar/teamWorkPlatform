import config from '../config';
import { doAuthenticatedRequest } from './urlRequest';

export const CONVERSATIONS_FETCH_SUCCESS = 'conversations/fetch/success';

export const fetchConversations = (teamRoomId = undefined, getKey = false) => {
  // requestUrl is the key into redux state.urlRequests.
  let requestUrl = `${config.hablaApiBaseUri}/conversations/getConversations`;
  requestUrl = (teamRoomId) ? `${requestUrl}?teamRoomId=${teamRoomId}` : requestUrl;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { teamRoomId };

  return (dispatch) => {
    const thunk = dispatch(doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    }, reduxState, getKey));

    if (!getKey) {
      thunk.then((response) => {
        if (response.data) {
          const { conversations } = response.data;
          dispatch({
            type: CONVERSATIONS_FETCH_SUCCESS,
            payload: { conversations }
          });
          return conversations;
        }
        return response;
      });
    }

    return thunk;
  };
};
