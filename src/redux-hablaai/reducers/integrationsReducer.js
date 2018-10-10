import _ from 'lodash';
import {
  INTEGRATIONS_FETCH_SUCCESS,
  INTEGRATIONS_FETCH_DETAILS_SUCCESS,
  INTEGRATIONS_REVOKE_SUCCESS,
  INTEGRATIONS_UPDATE,
  SHARING_SETTINGS_TOGGLE,
  SHARING_SETTINGS_TOGGLE_ALL,
  SHARING_SETTINGS_SAVE_REQUEST,
  SHARING_SETTINGS_SAVE_SUCCESS,
  SHARING_SETTINGS_SAVE_FAILURE
} from 'src/actions';
import { getIntegrationDetails } from 'src/selectors';

const INITIAL_STATE = {
  integrationsBySubscriberOrgId: {},
  integrationDetailsBySubscriberUserId: {},
  sharingSettings: {}
};

// recursively returns all ids of folders and files in the tree
const getAllIdsFromTree = tree =>
  _.reduce(
    tree,
    (acc, value, key) => {
      if (key === 'files') {
        acc.files = _.concat(acc.files, value.map(f => f.file_id));
      }
      if (key === 'folders') {
        acc.folders = _.concat(acc.folders, value.map(f => f.folder_id));
        const nestedItems = value.map(getAllIdsFromTree);

        if (!_.isEmpty(nestedItems)) {
          nestedItems.forEach(item => {
            acc.folders = _.concat(acc.folders, item.folders);
            acc.files = _.concat(acc.files, item.files);
          });
        }
      }
      return acc;
    },
    { files: [], folders: [] }
  );

const updateCurrentSettings = (state, action, newState) => {
  const { subscriberUserId, source } = action.payload;
  const currentSettings = state.sharingSettings[subscriberUserId] || {};
  const currentSourceSettings = currentSettings[source] || {};

  return {
    ...state.sharingSettings,
    [subscriberUserId]: {
      ...currentSettings,
      [source]: {
        ...currentSourceSettings,
        ...newState
      }
    }
  };
};

const integrationsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INTEGRATIONS_FETCH_SUCCESS: {
      const updateIntegrationsBySubscriberOrgId = _.cloneDeep(state.integrationsBySubscriberOrgId);
      action.payload.integrations.forEach(integration => {
        const updateIntegration = { ...integration };
        const { subscriberOrgId } = updateIntegration;
        delete updateIntegration.subscriberOrgId;
        updateIntegrationsBySubscriberOrgId[subscriberOrgId] = updateIntegration;
      });
      return {
        ...state,
        integrationsBySubscriberOrgId: updateIntegrationsBySubscriberOrgId
      };
    }
    case INTEGRATIONS_REVOKE_SUCCESS: {
      if (action.error) {
        return state;
      }

      const integrationsBySubscriberOrgId = _.cloneDeep(state.integrationsBySubscriberOrgId);
      const integrations = integrationsBySubscriberOrgId[action.payload.subscriberOrgId];
      if (integrations) {
        integrations[action.payload.type] = { revoked: true };
      }
      return {
        ...state,
        integrationsBySubscriberOrgId
      };
    }
    case INTEGRATIONS_UPDATE: {
      const { subscriberOrgId, integrations } = action.payload;
      const integrationsBySubscriberOrgId = _.cloneDeep(state.integrationsBySubscriberOrgId);
      integrationsBySubscriberOrgId[subscriberOrgId] = integrations;
      return {
        ...state,
        integrationsBySubscriberOrgId
      };
    }
    case INTEGRATIONS_FETCH_DETAILS_SUCCESS: {
      const { integrationDetails } = action.payload;
      const { subscriber_user_id: subscriberUserId, source } = integrationDetails;
      const currentDetails = state.integrationDetailsBySubscriberUserId[subscriberUserId] || {};
      const integrationDetailsBySubscriberUserId = {
        ...state.integrationDetailsBySubscriberUserId,
        [subscriberUserId]: {
          ...currentDetails,
          [source]: { ...integrationDetails }
        }
      };
      return { ...state, integrationDetailsBySubscriberUserId };
    }
    case SHARING_SETTINGS_TOGGLE: {
      const { subscriberUserId, source, folderId, fileId } = action.payload;
      const currentSettings = state.sharingSettings[subscriberUserId] || {};
      const { folders, files } = currentSettings[source] || {};

      const sharingSettings = {
        ...state.sharingSettings,
        [subscriberUserId]: {
          ...currentSettings,
          [source]: {
            folders: folderId ? _.xor(folders, [folderId]) : folders,
            files: fileId ? _.xor(files, [fileId]) : files
          }
        }
      };
      return { ...state, sharingSettings };
    }
    case SHARING_SETTINGS_TOGGLE_ALL: {
      const { subscriberUserId, source } = action.payload;
      const integrationDetails = getIntegrationDetails(state, { source, subscriberUserId });
      const currentSubscriberSettings = state.sharingSettings[subscriberUserId] || {};
      const { folders, files } = currentSubscriberSettings[source] || {};
      const allEmpty = _.isEmpty(folders) && _.isEmpty(files);
      const settings = allEmpty ? getAllIdsFromTree(integrationDetails) : { folders: [], files: [] };

      const sharingSettings = {
        ...state.sharingSettings,
        [subscriberUserId]: {
          ...currentSubscriberSettings,
          [source]: settings
        }
      };
      return { ...state, sharingSettings };
    }
    case SHARING_SETTINGS_SAVE_REQUEST:
      return {
        ...state,
        sharingSettings: updateCurrentSettings(state, action, { submitting: true, saved: false })
      };
    case SHARING_SETTINGS_SAVE_SUCCESS:
      return {
        ...state,
        sharingSettings: updateCurrentSettings(state, action, { submitting: false, saved: true })
      };
    case SHARING_SETTINGS_SAVE_FAILURE:
      return {
        ...state,
        sharingSettings: updateCurrentSettings(state, action, { submitting: false, saved: false })
      };
    default:
      return state;
  }
};

export default integrationsReducer;
