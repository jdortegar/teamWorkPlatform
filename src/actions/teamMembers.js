import axios from 'axios';
import config from '../config/env';
import { getJwt } from '../session';
import {
  REQUESTING_TEAM_MEMBERS,
  RECEIVE_TEAM_MEMBERS,
  REQUEST_TEAM_MEMBERS_ERROR
} from './types';

function requestingTeamMembers(teamId) {
  return { type: REQUESTING_TEAM_MEMBERS, payload: { teamId } };
}

export function receiveTeamMembers(teamMembers, teamId) {
  return {
    type: RECEIVE_TEAM_MEMBERS,
    payload: { teamMembers, teamId }
  };
}

export function requestTeamMembersError(error, teamId) {
  return { type: REQUEST_TEAM_MEMBERS_ERROR, meta: { teamId }, payload: error, error: true };
}

export function requestTeamMembers(teamId) {
  return (dispatch, getState) => {
    if (!getState().teams.working) {
      dispatch(requestingTeamMembers(teamId));
      const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };
      return axios.get(`${config.hablaApiBaseUri}/teams/getMembers/${teamId}`, axiosOptions)
        .then(response => response.data.teamMembers)
        .then(teamMembers => dispatch(receiveTeamMembers(teamMembers, teamId)))
        .catch(err => dispatch(requestTeamMembersError(err, teamId)));
    }
    return Promise.resolve();
  };
}
