import axios from 'axios';
import config from '../config/env';
import { getJwt } from '../session';
import {
  REQUEST_CONVERSATIONS,
  RECEIVE_CONVERSATIONS,
  REQUEST_CONVERSATIONS_ERROR,
  REQUEST_TRANSCRIPT,
  RECEIVE_TRANSCRIPT,
  REQUEST_TRANSCRIPT_ERROR,
  SET_ACTIVE_CONVERSATION
} from './types';

export function requestingConversations({ teamRoomId }) {
  return { type: REQUEST_CONVERSATIONS, payload: { teamRoomId } };
}

export function receiveConversations(conversations, { teamRoomId }) {
  return {
    type: RECEIVE_CONVERSATIONS,
    payload: { teamRoomId, conversations }
  };
}

export function requestConversationsError(error, { teamRoomId }) {
  return { type: REQUEST_CONVERSATIONS_ERROR, payload: new Error(error, { teamRoomId }), error: true };
}

export function requestConversations({ teamRoomId }) {
  const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };

  return (dispatch) => {
    dispatch(requestingConversations({ teamRoomId }));
    let url = `${config.hablaApiBaseUri}/conversations/getConversations`;
    url += (teamRoomId) ? `?teamRoomId=${teamRoomId}` : url;
    return axios.get(url, axiosOptions)
      .then(response => response.data.conversations)
      .then(conversations => dispatch(receiveConversations(conversations, { teamRoomId })))
      .catch(err => dispatch(requestConversationsError(err, { teamRoomId })));
  };
}


export function requestingTranscript({ conversationId }) {
  return { type: REQUEST_TRANSCRIPT, payload: { conversationId } };
}

export function receiveTranscript(conversationId, transcript) {
  return {
    type: RECEIVE_TRANSCRIPT,
    payload: { conversationId, transcript }
  };
}

export function requestTranscriptError(error, conversationId) {
  return { type: REQUEST_TRANSCRIPT_ERROR, payload: new Error(error, conversationId), error: true };
}

export function requestTranscript(conversationId) {
  const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };

  return (dispatch) => {
    dispatch(requestingTranscript(conversationId));
    return axios.get(`${config.hablaApiBaseUri}/conversations/getTranscript/${conversationId}`, axiosOptions)
      .then(response => response.data.messages)
      .then(messages => dispatch(receiveTranscript(conversationId, messages)))
      .catch(err => dispatch(requestTranscriptError(err, conversationId)));
  };
}

export function setActiveConversation(conversationId = null) {
  return {
    type: SET_ACTIVE_CONVERSATION,
    payload: { conversationId }
  };
}
