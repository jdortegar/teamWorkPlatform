import axios from 'axios';
import config from '../config/env';
import { getJwt } from '../session';
import {
  REQUEST_TEAMS,
  RECEIVE_TEAMS,
  REQUEST_TEAMS_ERROR,
  SET_CURRENT_TEAM,
  GET_ALL_TEAMS
} from './types';

export function requestingTeams(subscriberOrgId) {
  return { type: REQUEST_TEAMS, payload: { subscriberOrgId } };
}

export function receiveTeams(subscriberOrgId, teams) {
  return {
    type: RECEIVE_TEAMS,
    payload: { subscriberOrgId, teams }
  };
}

export function requestTeamsError(error, subscriberOrgId) {
  return { type: REQUEST_TEAMS_ERROR, payload: new Error(error, subscriberOrgId), error: true };
}

export function getAllTeams() {
  const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };
  return (dispatch) => {
    return axios.get(`${config.hablaApiBaseUri}/teams/getTeams`, axiosOptions)
      .then((response) => {
        dispatch({ type: GET_ALL_TEAMS, payload: response.data.teams })
      })
      .catch(err => dispatch(requestTeamsError(err, subscriberOrgId)));
  };
}

export function requestTeams(subscriberOrgId) {
  const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };
  return (dispatch) => {
    dispatch(requestingTeams(subscriberOrgId));
    return axios.get(`${config.hablaApiBaseUri}/teams/getTeams?subscriberOrgId=${subscriberOrgId}`, axiosOptions)
      .then((response) => {
        console.log("here");
        dispatch(receiveTeams(subscriberOrgId, response.data.teams))
      })
      .catch(err => dispatch(requestTeamsError(err, subscriberOrgId)));
  };
}

export function setCurrentTeam(subscriberOrgId, team) {
  return {
    type: SET_CURRENT_TEAM,
    payload: { subscriberOrgId, team }
  };
}
