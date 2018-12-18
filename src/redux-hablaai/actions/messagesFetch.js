import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest } from './urlRequest';

export const MESSAGES_FETCH_SUCCESS = 'messages/fetch/success';

export const fetchMessages = conversationIdsMessagesIds => dispatch => {
  const requestUrl = buildApiUrl('conversations/getMessages');
  const thunk = dispatch(
    doAuthenticatedRequest(
      {
        requestUrl,
        method: 'post',
        data: { messages: conversationIdsMessagesIds }
      },
      { conversationIdsMessagesIds }
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
