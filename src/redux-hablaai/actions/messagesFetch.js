import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest } from './urlRequest';

export const MESSAGES_FETCH_SUCCESS = 'messages/fetch/success';

export const fetchMessages = conversationIdsMessagesIds => {
  const requestUrl = buildApiUrl('conversations/getMessages');

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { conversationIdsMessagesIds };

  return dispatch => {
    const thunk = dispatch(
      doAuthenticatedRequest(
        {
          requestUrl,
          method: 'post',
          data: { messages: conversationIdsMessagesIds }
        },
        reduxState,
        { forceGet: true }
      )
    );

    thunk.then(response => {
      if (response.data) {
        const { messages } = response.data;
        dispatch({
          type: MESSAGES_FETCH_SUCCESS,
          payload: { messages }
        });
        return messages;
      }
      return response;
    });
  };
};
