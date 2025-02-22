import { combineReducers } from 'redux';

import {
  SHARING_SETTINGS_TOGGLE,
  SHARING_SETTINGS_TOGGLE_ALL,
  SHARING_SETTINGS_SAVE_REQUEST,
  SHARING_SETTINGS_SAVE_SUCCESS,
  SHARING_SETTINGS_SAVE_FAILURE,
  TEAM_SHARING_SETTINGS_SAVE_REQUEST,
  TEAM_SHARING_SETTINGS_SAVE_SUCCESS,
  TEAM_SHARING_SETTINGS_SAVE_FAILURE,
  TEAM_SHARING_SETTINGS_TOGGLE,
  TEAM_SHARING_SETTINGS_TOGGLE_ALL,
  INTEGRATIONS_REVOKE_SUCCESS,
  TEAM_INTEGRATIONS_REVOKE_SUCCESS
} from 'src/actions';

const INITIAL_SETTINGS = {
  folders: [],
  files: [],
  sites: {},
  submitting: false,
  saved: false
};

const updateSettings = (state, id, source, updatedData = {}) => {
  const settings = state[id] || {};
  const sourceSettings = settings[source] || INITIAL_SETTINGS;
  return {
    ...state,
    [id]: {
      ...settings,
      [source]: { ...sourceSettings, ...updatedData }
    }
  };
};

const updateOrgSettings = (state, { subscriberUserId, source }, updatedData = {}) =>
  updateSettings(state, subscriberUserId, source, { ...updatedData, subscriberUserId });

const updateTeamSettings = (state, { subscriberUserId, teamId, source }, updatedData = {}) =>
  updateSettings(state, teamId, source, { ...updatedData, subscriberUserId, teamId });

const byOrg = (state = {}, action) => {
  switch (action.type) {
    case SHARING_SETTINGS_TOGGLE:
    case SHARING_SETTINGS_TOGGLE_ALL: {
      const { folders, files, sites } = action.payload;
      return updateOrgSettings(state, action.payload, { folders, files, sites });
    }
    case SHARING_SETTINGS_SAVE_REQUEST:
      return updateOrgSettings(state, action.payload, {
        submitting: true,
        saved: false
      });
    case SHARING_SETTINGS_SAVE_SUCCESS:
      return updateOrgSettings(state, action.payload, {
        submitting: false,
        saved: true
      });
    case SHARING_SETTINGS_SAVE_FAILURE:
    case INTEGRATIONS_REVOKE_SUCCESS:
      return updateOrgSettings(state, action.payload, {
        submitting: false,
        saved: false
      });
    default:
      return state;
  }
};

const byTeam = (state = {}, action) => {
  switch (action.type) {
    case TEAM_SHARING_SETTINGS_TOGGLE:
    case TEAM_SHARING_SETTINGS_TOGGLE_ALL: {
      const { folders, files, sites } = action.payload;
      return updateTeamSettings(state, action.payload, { folders, files, sites });
    }
    case TEAM_SHARING_SETTINGS_SAVE_REQUEST:
      return updateTeamSettings(state, action.payload, {
        submitting: true,
        saved: false
      });
    case TEAM_SHARING_SETTINGS_SAVE_SUCCESS:
      return updateTeamSettings(state, action.payload, {
        submitting: false,
        saved: true
      });
    case TEAM_SHARING_SETTINGS_SAVE_FAILURE:
    case TEAM_INTEGRATIONS_REVOKE_SUCCESS:
      return updateTeamSettings(state, action.payload, {
        submitting: false,
        saved: false
      });
    default:
      return state;
  }
};

export default combineReducers({ byOrg, byTeam });
