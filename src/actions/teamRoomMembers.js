import axios from 'axios';
import config from '../config/env';
import { getJwt } from '../session';
import {
  REQUESTING_TEAM_ROOM_MEMBERS,
  RECEIVE_TEAM_ROOM_MEMBERS,
  REQUEST_TEAM_ROOM_MEMBERS_ERROR
} from './types';

function requestingTeamRoomMembers(teamRoomId) {
  return { type: REQUESTING_TEAM_ROOM_MEMBERS, payload: { teamRoomId } };
}

export function receiveTeamRoomMembers(teamRoomMembers, teamRoomId) {
  return {
    type: RECEIVE_TEAM_ROOM_MEMBERS,
    payload: { teamRoomMembers, teamRoomId }
  };
}

export function requestTeamRoomMembersError(error, teamRoomId) {
  return { type: REQUEST_TEAM_ROOM_MEMBERS_ERROR, meta: { teamRoomId }, payload: error, error: true };
}

export function requestTeamRoomMembers(teamRoomId) {
  return (dispatch, getState) => {
    if (!getState().teams.requesting) {
      dispatch(requestingTeamRoomMembers(teamRoomId));
      const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };
      return axios.get(`${config.hablaApiBaseUri}/teamRooms/getMembers/${teamRoomId}`, axiosOptions)
        .then(response => response.data.teamRoomMembers)
        .then(teamRoomMembers => dispatch(receiveTeamRoomMembers(teamRoomMembers, teamRoomId)))
        .catch(err => dispatch(requestTeamRoomMembersError(err, teamRoomId)));
    }
    return Promise.resolve();
  };
}
