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
export const MESSAGE_UPDATE_SUCCESS = 'messages/update/success';
export const MESSAGE_UPDATE_FAILURE = 'messages/update/failure';

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
    throw new Error(e);
  }
};

const getPercentOfRequest = ({ total, loaded }) => Math.round((loaded * 100) / total);

export const uploadFile = (file, conversationId, onUploadProgress = () => {}) => (dispatch, getState) => {
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
    doAuthenticatedRequest(
      {
        requestUrl,
        method: 'post',
        data,
        onUploadProgress: progress =>
          onUploadProgress({ name: file.name, size: file.size, percent: getPercentOfRequest(progress) })
      },
      data
    )
  );
};

export const createMessage = ({
  text,
  conversationId,
  replyTo,
  file,
  emojiReaction,
  dataforShare,
  onFileUploadProgress
}) => async (dispatch, getState) => {
  const requestUrl = buildChatUrl(`conversations/${conversationId}/messages`);
  const userId = getCurrentUserId(getState());
  const content = [];

  if (emojiReaction) {
    content.push({ text, type: 'emojiReaction', colons: emojiReaction });
  } else if (text) {
    content.push({ text, type: 'text/plain' });
  }

  if (dataforShare) {
    const [sharedContent] = dataforShare.content || [];
    if (sharedContent) content.push(sharedContent);
  }

  try {
    if (file) {
      // upload file and attach it to the message content
      const uploadedFile = await dispatch(uploadFile(file, conversationId, onFileUploadProgress));
      content.push({
        type: file.type,
        meta: {
          fileUrl: uploadedFile.data.fileUrl,
          fileName: uploadedFile.data.fileName,
          size: file.size
        }
      });
    }

    const data = { content, userId, replyTo: replyTo ? replyTo.id : undefined };
    const { data: message } = await dispatch(doAuthenticatedRequest({ requestUrl, method: 'post', data }, data));

    dispatch({ type: MESSAGE_CREATE_SUCCESS, payload: { message, conversationId } });
    return message;
  } catch (e) {
    const error = e.response ? { ...e.response.data } : e;
    dispatch({ type: MESSAGE_CREATE_FAILURE, payload: { error } });
    throw new Error(e);
  }
};

export const updateMessage = (message, text) => async dispatch => {
  const requestUrl = buildChatUrl(`messages/${message.id}`);
  const attachments = message.content.filter(item => item.type !== 'text/plain');
  const content = [{ type: 'text/plain', text }, ...attachments];

  try {
    const { data: updatedMessage } = await dispatch(
      doAuthenticatedRequest({ requestUrl, method: 'patch', data: { content } })
    );
    dispatch({ type: MESSAGE_UPDATE_SUCCESS, payload: { message: updatedMessage } });
    return updatedMessage;
  } catch (e) {
    const error = e.response ? { ...e.response.data } : e;
    dispatch({ type: MESSAGE_UPDATE_FAILURE, payload: { error } });
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
    throw new Error(e);
  }
};
