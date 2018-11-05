import { combineReducers } from 'redux';

import {
  SHARING_SETTINGS_TOGGLE,
  SHARING_SETTINGS_TOGGLE_ALL,
  SHARING_SETTINGS_SAVE_REQUEST,
  SHARING_SETTINGS_SAVE_SUCCESS,
  SHARING_SETTINGS_SAVE_FAILURE,
  INTEGRATIONS_REVOKE_SUCCESS
} from 'src/actions';

const INITIAL_SETTINGS = {
  folders: [],
  files: [],
  submitting: false,
  saved: false
};

const updateOrgSettings = (state, { subscriberUserId, source }, updatedData = {}) => {
  const orgSettings = state[subscriberUserId] || {};
  const sourceSettings = orgSettings[source] || INITIAL_SETTINGS;
  return {
    ...state,
    [subscriberUserId]: {
      ...orgSettings,
      [source]: { ...sourceSettings, ...updatedData }
    }
  };
};

const byOrg = (state = {}, action) => {
  switch (action.type) {
    case SHARING_SETTINGS_TOGGLE:
    case SHARING_SETTINGS_TOGGLE_ALL: {
      const { subscriberUserId, source, folders, files } = action.payload;
      return updateOrgSettings(state, { subscriberUserId, source }, { folders, files });
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
      return updateOrgSettings(state, action.payload, {
        submitting: false,
        saved: false
      });
    case INTEGRATIONS_REVOKE_SUCCESS:
      return updateOrgSettings(state, action.payload, INITIAL_SETTINGS);
    default:
      return state;
  }
};

export default combineReducers({ byOrg });
