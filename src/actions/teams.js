import axios from 'axios';
import config from '../config/env';
import { getJwt } from '../session';
import {
  REQUEST_TEAMS,
  RECEIVE_TEAMS,
  REQUEST_TEAMS_ERROR,
  SET_CURRENT_TEAM
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

export function requestTeams(subscriberOrgId) {
  const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };

  return (dispatch) => {
    dispatch(requestingTeams(subscriberOrgId));
    return axios.get(`${config.hablaApiBaseUri}/teams/getTeams?subscriberOrgId=${subscriberOrgId}`, axiosOptions)
      .then(response => response.data.teams)
      .then(teams => dispatch(receiveTeams(subscriberOrgId, teams)))
      .catch(err => dispatch(requestTeamsError(err, subscriberOrgId)));
  };
}

export function setCurrentTeam(subscriberOrgId, team) {
  return {
    type: SET_CURRENT_TEAM,
    payload: { subscriberOrgId, team }
  };
}
