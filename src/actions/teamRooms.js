import axios from 'axios';
import config from '../config/env';
import { getJwt } from '../session';
import {
  REQUEST_TEAM_ROOMS,
  RECEIVE_TEAM_ROOMS,
  REQUEST_TEAM_ROOMS_ERROR,
  SET_CURRENT_TEAM_ROOM
} from './types';

export function requestingTeamRooms(subscriberOrgId, teamId) {
  return { type: REQUEST_TEAM_ROOMS, payload: { subscriberOrgId, teamId } };
}

export function receiveTeamRooms(subscriberOrgId, teamId, teamRooms) {
  return {
    type: RECEIVE_TEAM_ROOMS,
    payload: { subscriberOrgId, teamId, teamRooms }
  };
}

export function requestTeamRoomsError(error, subscriberOrgId, teamId) {
  return { type: REQUEST_TEAM_ROOMS_ERROR, payload: new Error(error, subscriberOrgId, teamId), error: true };
}

export function requestTeamRooms(subscriberOrgId, teamId) {
  const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };

  return (dispatch) => {
    dispatch(requestingTeamRooms(subscriberOrgId, teamId));
    return axios.get(`${config.hablaApiBaseUri}/teamRooms/getTeamRooms?teamId=${teamId}`, axiosOptions)
      .then(response => response.data.teamRooms)
      .then(teamRooms => dispatch(receiveTeamRooms(subscriberOrgId, teamId, teamRooms)))
      .catch(err => dispatch(requestTeamRoomsError(err, subscriberOrgId, teamId)));
  };
}

export function setCurrentTeamRoom(subscriberOrgId, teamId, teamRoom) {
  return {
    type: SET_CURRENT_TEAM_ROOM,
    payload: { subscriberOrgId, teamId, teamRoom }
  };
}
