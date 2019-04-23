import { buildChatUrl } from 'src/lib/api';
import { getCurrentUserId, getCurrentOrgId } from 'src/selectors';
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

const getPercentOfRequest = ({ total, loaded }) => Math.round((loaded * 100) / total);

export const uploadFile = (file, conversationId, onUploadProgress = () => {}) => async (dispatch, getState) => {
  const requestUrl = buildChatUrl(`conversations/${conversationId}/files`);
  const orgId = getCurrentOrgId(getState());
  const content = file.src.split('base64,')[1] || file.src;

  const data = {
    content,
    contentType: file.type,
    fileName: file.name,
    metadata: { orgId }
  };

  return dispatch(
    doAuthenticatedRequest({
      requestUrl,
      method: 'post',
      data,
      onUploadProgress: progress =>
        onUploadProgress({ name: file.name, size: file.size, percent: getPercentOfRequest(progress) })
    })
  );
};

export const createMessage = ({
  text,
  conversationId,
  replyTo,
  files = [],
  emojiReaction,
  onFileUploadProgress
}) => async (dispatch, getState) => {
  const requestUrl = buildChatUrl(`conversations/${conversationId}/messages`);
  const userId = getCurrentUserId(getState());
  let content = [];

  if (emojiReaction) {
    content.push({ text, type: 'emojiReaction', colons: emojiReaction });
  } else if (text) {
    content.push({ text, type: 'text/plain' });
  }

  try {
    // upload files and attach them to the message
    const requests = files.map(file => dispatch(uploadFile(file, conversationId, onFileUploadProgress)));
    const responses = await Promise.all(requests);
    const resources = responses.map((response, index) => ({
      type: files[index].type,
      meta: {
        fileUrl: response.data.fileUrl,
        fileName: response.data.fileName,
        size: files[index].size
      }
    }));
    content = [...content, ...resources];
  } catch (e) {
    const error = e.response ? { ...e.response.data } : e;
    dispatch({ type: MESSAGE_CREATE_FAILURE, payload: { error } });
    throw new Error(e);
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
    dispatch({ type: MESSAGE_CREATE_FAILURE, payload: { error } });
    throw new Error(e);
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
