import config from 'config/env';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const TRANSCRIPT_FETCH_SUCCESS = 'transcript/fetch/success';

export const fetchTranscript = (conversationId, options = { getKey: false, forceGet: false }) => {
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/conversations/getTranscript/${conversationId}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { conversationId };

  return (dispatch) => {
    const thunk = dispatch(doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    }, reduxState, options));

    if (!options.getKey) {
      thunk.then((response) => {
        if ((response.data) && (response.data !== RESPONSE_STALE)) {
          const { messages } = response.data;
          dispatch({
            type: TRANSCRIPT_FETCH_SUCCESS,
            payload: { messages, conversationId }
          });
          return messages;
        }
        return response;
      });
    }

    return thunk;
  };
};
