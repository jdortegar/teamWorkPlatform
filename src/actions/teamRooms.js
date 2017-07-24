import axios from 'axios';
import config from '../config/env';
import { getJwt } from '../session';
import {
  REQUESTING_TEAM_ROOMS,
  RECEIVE_ALL_TEAM_ROOMS,
  RECEIVE_TEAM_ROOMS,
  REQUEST_TEAM_ROOMS_ERROR,
  SET_CURRENT_TEAM_ROOM_ID
} from './types';

export function requestingTeamRooms(teamId) {
  return { type: REQUESTING_TEAM_ROOMS, payload: { teamId } };
}

export function receiveTeamRooms(teamRooms, teamId) {
  return {
    type: RECEIVE_TEAM_ROOMS,
    payload: { teamId, teamRooms }
  };
}

export function requestTeamRoomsError(error, teamId) {
  return { type: REQUEST_TEAM_ROOMS_ERROR, payload: new Error(error, teamId), error: true };
}

export function requestAllTeamRooms() {
  return (dispatch, getState) => {
    if (!getState().teamRooms.requesting) {
      dispatch(requestingTeamRooms());
      const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };
      return axios.get(`${config.hablaApiBaseUri}/teamRooms/getTeamRooms`, axiosOptions)
        .then((response) => {
          dispatch({ type: RECEIVE_ALL_TEAM_ROOMS, payload: response.data.teamRooms });
        })
        .catch(err => dispatch(requestTeamRoomsError(err)));
    }
    return Promise.resolve();
  };
}

export function requestTeamRooms(teamId) {
  return (dispatch, getState) => {
    if (!getState().teamRooms.requesting) {
      dispatch(requestingTeamRooms(teamId));
      const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };
      return axios.get(`${config.hablaApiBaseUri}/teamRooms/getTeamRooms?teamId=${teamId}`, axiosOptions)
        .then(response => response.data.teamRooms)
        .then(teamRooms => dispatch(receiveTeamRooms(teamRooms, teamId)))
        .catch(err => dispatch(requestTeamRoomsError(err, teamId)));
    }
    return Promise.resolve();
  };
}

export function setCurrentTeamRoomId(teamId, teamRoomId) {
  return {
    type: SET_CURRENT_TEAM_ROOM_ID,
    payload: { teamId, teamRoomId }
  };
}
