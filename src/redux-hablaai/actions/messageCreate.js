import moment from 'moment';
import uuid from 'uuid/v4';
import { buildApiUrl } from 'src/lib/api';
import { getCurrentSubscriberOrgId, getCurrentUserId } from 'src/selectors';
import { doAuthenticatedRequest } from './urlRequest';

export const MESSAGE_CREATE_REQUEST = 'messages/create/request';
export const MESSAGE_CREATE_SUCCESS = 'messages/create/success';
export const MESSAGE_CREATE_FAILURE = 'messages/create/failure';

const getPercentOfRequest = ({ total, loaded }) => Math.round((loaded * 100) / total);

const createResource = (file, resourcesUrl, conversationId, orgId, onUploadProgress = () => {}) => {
  const requestUrl = `${resourcesUrl}/${file.name}`;
  const fileSource = file.src.split('base64,')[1] || file.src;

  return doAuthenticatedRequest({
    requestUrl,
    method: 'put',
    data: fileSource,
    additionalHeaders: {
      'Content-Type': 'application/octet-stream',
      'x-hablaai-content-type': file.type,
      'x-hablaai-content-length': fileSource.length,
      'x-hablaai-teamid': conversationId,
      'x-hablaai-subscriberorgid': orgId
    },
    onUploadProgress: progress =>
      onUploadProgress({ name: file.name, size: file.size, percent: getPercentOfRequest(progress) })
  });
};

export const createMessage = ({
  message,
  conversationId,
  sharedProfileId,
  replyTo,
  files = [],
  resourcesUrl,
  onFileUploadProgress
}) => (dispatch, getState) => {
  const localId = uuid();
  const orgId = getCurrentSubscriberOrgId(getState());
  const userId = getCurrentUserId(getState());

  if (message || sharedProfileId) {
    // create a message with a localId to display immediately in the screen
    const path = replyTo ? `${replyTo.path || replyTo.messageId}##${localId}` : localId;
    const level = replyTo ? replyTo.level + 1 : 0;
    dispatch({
      type: MESSAGE_CREATE_REQUEST,
      payload: {
        conversationId,
        message: {
          localId,
          messageId: localId,
          conversationId,
          created: moment().format(),
          createdBy: userId,
          replyTo: replyTo ? replyTo.messageId : undefined,
          path,
          level,
          sharedProfileId,
          content: [{ type: 'text/plain', text: message }]
        }
      }
    });
  }

  const requestUrl = buildApiUrl(`conversations/${conversationId}/createMessage`);

  // send all files to AWS before posting the message
  const requests = files.map(file =>
    dispatch(createResource(file, resourcesUrl, conversationId, orgId, onFileUploadProgress))
  );

  return Promise.all(requests).then(resources => {
    // create an array of the attached files
    const content = resources.map((resource, index) => ({
      resourceId: resource.data.resourceId,
      type: files[index].type,
      meta: {
        fileName: files[index].name,
        fileSize: files[index].size,
        lastModified: files[index].lastModifiedDate
      }
    }));

    // add the message text
    if (message) {
      content.push({ type: 'text/plain', text: message });
    }

    const thunk = dispatch(
      doAuthenticatedRequest({
        requestUrl,
        method: 'post',
        data: {
          replyTo: replyTo ? replyTo.messageId : undefined,
          content,
          sharedProfileId
        }
      })
    );

    thunk.then(
      response => dispatch({ type: MESSAGE_CREATE_SUCCESS, payload: { ...response.data, conversationId, localId } }),
      error => dispatch({ type: MESSAGE_CREATE_FAILURE, payload: { localId, conversationId }, error })
    );

    return thunk;
  });
};
