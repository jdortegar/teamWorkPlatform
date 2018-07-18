import config from 'config/env';
import { doAuthenticatedRequest } from './urlRequest';

export const MESSAGES_FETCH_SUCCESS = 'messages/fetch/success';

/**
 * @param conversationIdsMessagesIds array of objects of { conversationId, messageId }.
 */
export const fetchMessages = conversationIdsMessagesIds => {
  // requestUrl is the key into redux state.urlRequests.
  const requestUrl = `${config.hablaApiBaseUri}/conversations/getMessages`;

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
        reduxState
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
