import axios from 'axios';
import config from '../config/env';
import { getJwt } from '../session';
import {
  REQUESTING_TEAMS,
  RECEIVE_ALL_TEAMS,
  RECEIVE_TEAMS,
  REQUEST_TEAMS_ERROR,
  SET_CURRENT_TEAM_ID
} from './types';
import { requestAllTeamRooms } from './teamRooms';

function requestingTeams(subscriberOrgId) {
  return { type: REQUESTING_TEAMS, payload: { subscriberOrgId } };
}

export function receiveTeams(teams, subscriberOrgId) {
  return {
    type: RECEIVE_TEAMS,
    payload: { subscriberOrgId, teams }
  };
}

export function requestTeamsError(error, subscriberOrgId) {
  return { type: REQUEST_TEAMS_ERROR, errorMeta: { subscriberOrgId }, payload: error, error: true };
}

export function requestAllTeams() {
  return (dispatch, getState) => {
    if (!getState().teams.requesting) {
      dispatch(requestingTeams());
      const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };

      return axios.get(`${config.hablaApiBaseUri}/teams/getTeams`, axiosOptions)
        .then(response => dispatch({ type: RECEIVE_ALL_TEAMS, payload: { teams: response.data.teams } }))
        .catch(err => dispatch(requestTeamsError(err)));
    }
    return Promise.resolve();
  };
}

export function requestTeams(subscriberOrgId) {
  return (dispatch, getState) => {
    if (!getState().teams.requesting) {
      dispatch(requestingTeams(subscriberOrgId));
      const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };
      return axios.get(`${config.hablaApiBaseUri}/teams/getTeams?subscriberOrgId=${subscriberOrgId}`, axiosOptions)
        .then(response => dispatch(receiveTeams(response.data.teams, subscriberOrgId)))
        .catch(err => dispatch(requestTeamsError(err, subscriberOrgId)));
    }
    return Promise.resolve();
  };
}

export function createTeam(name, orgId) {
  const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };

  return (dispatch) => {
    return axios.post(`${config.hablaApiBaseUri}/teams/createTeam/${orgId}`, name, axiosOptions)
      .then(() => {
        dispatch(requestAllTeams());
        dispatch(requestAllTeamRooms());
      })
      .catch(err => dispatch(requestTeamsError(err, orgId)));
  };
}

export function setCurrentTeamId(subscriberOrgId, teamId) {
  return {
    type: SET_CURRENT_TEAM_ID,
    payload: { subscriberOrgId, teamId }
  };
}
