import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const CONVERSATIONS_FETCH_SUCCESS = 'conversations/fetch/success';

export const fetchConversations = (teamId = undefined, options = { getKey: false, forceGet: false }) => {
  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { teamId };

  return dispatch => {
    const thunk = dispatch(
      doAuthenticatedRequest(
        {
          requestUrl: buildApiUrl('conversations/getConversations'),
          method: 'get'
        },
        reduxState,
        options
      )
    );

    if (!options.getKey) {
      thunk.then(response => {
        if (response.data && response.data !== RESPONSE_STALE) {
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
