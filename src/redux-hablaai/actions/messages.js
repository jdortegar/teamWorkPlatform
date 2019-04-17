import { buildChatUrl } from 'src/lib/api';
import { getCurrentUserId } from 'src/selectors';
import { doAuthenticatedRequest } from './urlRequest';

export const MESSAGES_FETCH_SUCCESS = 'messages/fetch/success';
export const MESSAGES_FETCH_FAILURE = 'messages/fetch/failure';
export const MESSAGE_CREATE_REQUEST = 'messages/create/request';
export const MESSAGE_CREATE_SUCCESS = 'messages/create/success';
export const MESSAGE_CREATE_FAILURE = 'messages/create/failure';
export const MESSAGE_DELETE_SUCCESS = 'messages/delete/success';
export const MESSAGE_DELETE_FAILURE = 'messages/delete/failure';

export const fetchMessages = conversationId => async dispatch => {
  const requestUrl = buildChatUrl(`conversations/${conversationId}/messages`);

  try {
    const { data = {} } = await dispatch(doAuthenticatedRequest({ requestUrl, method: 'get' }));
    const { items: messages, pagination } = data;
    dispatch({ type: MESSAGES_FETCH_SUCCESS, payload: { messages, pagination, conversationId } });
    return messages;
  } catch (e) {
    const error = e.response ? { ...e.response.data } : e;
    dispatch({ type: MESSAGES_FETCH_FAILURE, payload: { error } });
    return error;
  }
};

export const createMessage = ({ text, conversationId, replyTo, emojiReaction }) => async (dispatch, getState) => {
  const requestUrl = buildChatUrl(`conversations/${conversationId}/messages`);
  const userId = getCurrentUserId(getState());
  const content = [];

  if (emojiReaction) {
    content.push({ text, type: 'emojiReaction', colons: emojiReaction });
  } else if (text) {
    content.push({ text, type: 'text/plain' });
  }

  const body = {
    content,
    userId,
    replyTo: replyTo ? replyTo.id : undefined
  };

  try {
    const { data: message } = await dispatch(doAuthenticatedRequest({ requestUrl, method: 'post', data: body }));
    dispatch({ type: MESSAGE_CREATE_SUCCESS, payload: { message, conversationId } });
    return message;
  } catch (e) {
    const error = e.response ? { ...e.response.data } : e;
    dispatch({ type: MESSAGES_FETCH_FAILURE, payload: { error } });
    return error;
  }
};

export const deleteMessage = message => async dispatch => {
  const requestUrl = buildChatUrl(`messages/${message.id}`);

  try {
    await dispatch(doAuthenticatedRequest({ requestUrl, method: 'delete' }));
    dispatch({ type: MESSAGE_DELETE_SUCCESS, payload: { message } });
    return message;
  } catch (e) {
    const error = e.response ? { ...e.response.data } : e;
    dispatch({ type: MESSAGE_DELETE_FAILURE, payload: { error } });
    return error;
  }
};
