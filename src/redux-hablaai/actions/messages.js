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
export const MESSAGE_SCHEDULE_CREATE_SUCCESS = 'messages/schedule/create/success';
export const MESSAGE_SCHEDULE_DELETE_SUCCESS = 'messages/schedule/delete/success';
export const MESSAGE_SCHEDULE_CREATE_FAILURE = 'messages/schedule/create/failure';
export const MESSAGE_SCHEDULE_UPDATE_SUCCESS = 'messages/schedule/update/success';
export const MESSAGE_SCHEDULE_UPDATE_FAILURE = 'messages/schedule/update/failure';
export const MESSAGES_SCHEDULE_FETCH_SUCCESS = 'messages/schedule/fetch/success';
export const MESSAGES_SCHEDULE_FETCH_FAILURE = 'messages/schedule/fetch/failure';

export const fetchMessages = (conversationId, nextPage = null) => async (dispatch, getState) => {
  let requestUrl = buildChatUrl(`conversations/${conversationId}/messages`);
  if (nextPage) requestUrl += `?page=${nextPage}`;

  const currentUserId = getCurrentUserId(getState());

  try {
    const { data = {} } = await dispatch(doAuthenticatedRequest({ requestUrl, method: 'get' }));
    const { items: messages, pagination } = data;
    dispatch({ type: MESSAGES_FETCH_SUCCESS, payload: { messages, pagination, conversationId, currentUserId } });
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

  try {
    if (file) {
      // upload file and attach it to the message content
      const uploadedFile = await dispatch(uploadFile(file, conversationId, onFileUploadProgress));
      content.push({
        type: file.type,
        text: 'File attached',
        meta: {
          fileUrl: uploadedFile.data.fileUrl,
          fileName: uploadedFile.data.fileName,
          size: file.size
        }
      });
    }

    const data = { content, userId, replyTo: replyTo ? replyTo.id : undefined };
    if (dataforShare && dataforShare.content[0].type === 'userId') {
      content.push({ text: 'User Profile card', type: 'userId' });
      data.appData = { userId: dataforShare.content[0].text };
    } else if (dataforShare) {
      content.push({ text: 'New forwarded Message', type: 'sharedData' });
      data.appData = { dataforShare };
    }

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

export const createScheduleMessage = ({
  text,
  conversationId,
  replyTo,
  file,
  onFileUploadProgress,
  date,
  appData = {}
}) => async (dispatch, getState) => {
  const requestUrl = buildChatUrl(`conversations/${conversationId}/schedules`);
  const userId = getCurrentUserId(getState());
  const content = [];

  if (text) {
    content.push({ text, type: 'text/plain' });
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

    const data = { content, userId, replyTo: replyTo ? replyTo.id : undefined, schedule: date.format(), appData };
    const { data: message } = await dispatch(doAuthenticatedRequest({ requestUrl, method: 'post', data }, data));

    dispatch({ type: MESSAGE_SCHEDULE_CREATE_SUCCESS, payload: { message, conversationId } });
    return message;
  } catch (e) {
    throw new Error(e);
  }
};

export const deleteScheduleMessage = message => async dispatch => {
  const scheduleId = message.id;
  const requestUrl = buildChatUrl(`schedules/${scheduleId}`);

  try {
    const data = { scheduleId };
    const reponse = await dispatch(doAuthenticatedRequest({ requestUrl, method: 'delete', data }, data));
    if (reponse) {
      dispatch({ type: MESSAGE_SCHEDULE_DELETE_SUCCESS, payload: { message } });
    }
    return message;
  } catch (e) {
    throw new Error(e);
  }
};

export const updateScheduleMessage = (message, text, date) => async dispatch => {
  const scheduleId = message.id;
  const requestUrl = buildChatUrl(`schedules/${scheduleId}`);
  const attachments = message.content.filter(item => item.type !== 'text/plain');
  const content = [{ type: 'text/plain', text }, ...attachments];

  try {
    const { data: updatedMessage } = await dispatch(
      doAuthenticatedRequest({ requestUrl, method: 'patch', data: { content, schedule: date } })
    );
    dispatch({ type: MESSAGE_SCHEDULE_UPDATE_SUCCESS, payload: { message: updatedMessage } });
    return updatedMessage;
  } catch (e) {
    const error = e.response ? { ...e.response.data } : e;
    dispatch({ type: MESSAGE_SCHEDULE_UPDATE_FAILURE, payload: { error } });
    throw new Error(e);
  }
};

export const fetchScheduleMessages = conversationId => async (dispatch, getState) => {
  const userId = getCurrentUserId(getState());
  const requestUrl = buildChatUrl(`users/${userId}/conversations/${conversationId}/schedules`);

  try {
    const { data = {} } = await dispatch(doAuthenticatedRequest({ requestUrl, method: 'get' }));
    const messages = data;
    dispatch({ type: MESSAGES_SCHEDULE_FETCH_SUCCESS, payload: { messages } });
    return messages;
  } catch (e) {
    const error = e.response ? { ...e.response.data } : e;
    dispatch({ type: MESSAGES_SCHEDULE_FETCH_FAILURE, payload: { error } });
    throw new Error(e);
  }
};

export const resetPagination = conversationId => dispatch => {
  dispatch({ type: MESSAGES_FETCH_FAILURE, payload: { conversationId } });
};
