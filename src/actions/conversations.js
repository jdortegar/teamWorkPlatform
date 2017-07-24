import axios from 'axios';
import config from '../config/env';
import { getJwt } from '../session';
import {
  REQUESTING_CONVERSATIONS,
  RECEIVE_CONVERSATIONS,
  REQUEST_CONVERSATIONS_ERROR,
  REQUESTING_TRANSCRIPT,
  RECEIVE_TRANSCRIPT,
  REQUEST_TRANSCRIPT_ERROR,
  SET_ACTIVE_CONVERSATION
} from './types';

function requestingConversations({ teamRoomId }) {
  return { type: REQUESTING_CONVERSATIONS, payload: { teamRoomId } };
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
      .then(conversations => dispatch({ type: RECEIVE_CONVERSATIONS, payload: { teamRoomId, conversations } }))
      .catch(err => dispatch(requestConversationsError(err, { teamRoomId })));
  };
}


function requestingTranscript({ conversationId }) {
  return { type: REQUESTING_TRANSCRIPT, payload: { conversationId } };
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
      .then(transcript => dispatch({ type: RECEIVE_TRANSCRIPT, payload: { conversationId, transcript } }))
      .catch(err => dispatch(requestTranscriptError(err, conversationId)));
  };
}

export function setActiveConversation(conversationId = null) {
  return {
    type: SET_ACTIVE_CONVERSATION,
    payload: { conversationId }
  };
}
