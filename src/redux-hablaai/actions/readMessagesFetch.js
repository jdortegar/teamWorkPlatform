import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const MESSAGES_READ_FETCH_SUCCESS = 'messages/read/fetch/success';

export const fetchReadMessages = (conversationId = undefined, options = { getKey: false, forceGet: false }) => {
  let requestUrl = buildApiUrl('conversations/getReadMessages');
  requestUrl = conversationId ? `${requestUrl}/${conversationId}` : requestUrl;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { conversationId };

  return dispatch => {
    const thunk = dispatch(
      doAuthenticatedRequest(
        {
          requestUrl,
          method: 'get'
        },
        reduxState,
        options
      )
    );

    if (!options.getKey) {
      thunk.then(response => {
        if (response.data && response.data !== RESPONSE_STALE) {
          const { readMessages } = response.data;
          dispatch({
            type: MESSAGES_READ_FETCH_SUCCESS,
            payload: { readMessages }
          });
          return readMessages;
        }
        return response;
      });
    }

    return thunk;
  };
};
