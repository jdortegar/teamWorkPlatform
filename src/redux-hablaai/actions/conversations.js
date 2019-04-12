import { buildChatUrl } from 'src/lib/api';
import { getCurrentUserId, getCurrentOrgId } from 'src/selectors';
import { doAuthenticatedRequest } from './urlRequest';

export const CONVERSATIONS_FETCH_SUCCESS = 'conversations/fetch/success';
export const CONVERSATIONS_FETCH_FAILURE = 'conversations/fetch/failure';
export const CONVERSATIONS_CREATE_SUCCESS = 'conversations/create/success';
export const CONVERSATIONS_CREATE_FAILURE = 'conversations/create/failure';

export const fetchConversations = () => async (dispatch, getState) => {
  const currentUserId = getCurrentUserId(getState());
  const requestUrl = buildChatUrl(`conversations?userId=${currentUserId}`);

  try {
    const { data: conversations } = await dispatch(
      doAuthenticatedRequest({
        requestUrl,
        method: 'get'
      })
    );

    dispatch({ type: CONVERSATIONS_FETCH_SUCCESS, payload: { conversations, currentUserId } });
    return conversations;
  } catch (e) {
    const error = e.response ? { ...e.response.data } : e;
    dispatch({ type: CONVERSATIONS_FETCH_FAILURE, payload: { error } });
    return error;
  }
};

export const createConversation = ({ members, title, description }) => async (dispatch, getState) => {
  const requestUrl = buildChatUrl('conversations');
  const currentUserId = getCurrentUserId(getState());
  const orgId = getCurrentOrgId(getState());

  const data = {
    members,
    title,
    description,
    organization: orgId
  };

  try {
    const { data: conversation } = await dispatch(doAuthenticatedRequest({ requestUrl, method: 'post', data }));
    dispatch({ type: CONVERSATIONS_CREATE_SUCCESS, payload: { conversation, currentUserId } });
    return conversation;
  } catch (e) {
    const error = { ...e.response.data };
    dispatch({ type: CONVERSATIONS_CREATE_FAILURE, payload: { error } });
    return error;
  }
};
