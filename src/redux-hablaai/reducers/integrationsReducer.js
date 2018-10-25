import { combineReducers } from 'redux';
import _ from 'lodash';

import {
  INTEGRATIONS_FETCH_SUCCESS,
  INTEGRATIONS_FETCH_CONTENT_REQUEST,
  INTEGRATIONS_FETCH_CONTENT_SUCCESS,
  INTEGRATIONS_FETCH_CONTENT_FAILURE,
  INTEGRATIONS_REVOKE_SUCCESS,
  INTEGRATIONS_UPDATE
  //   TEAM_INTEGRATIONS_FETCH_SUCCESS,
  //   SHARING_SETTINGS_TOGGLE,
  //   SHARING_SETTINGS_TOGGLE_ALL,
  //   SHARING_SETTINGS_SAVE_REQUEST,
  //   SHARING_SETTINGS_SAVE_SUCCESS,
  //   SHARING_SETTINGS_SAVE_FAILURE
} from 'src/actions';

// const INITIAL_STATE = {
//   byOrg: {},
//   byTeam: {},
//   integrationDetailsBySubscriberUserId: {},
//   sharingSettings: {}
// };

// recursively returns all ids of folders and files in the tree
// const getAllIdsFromTree = tree =>
//   _.reduce(
//     tree,
//     (acc, value, key) => {
//       if (key === 'files') {
//         acc.files = _.concat(acc.files, value.map(f => f.file_id));
//       }
//       if (key === 'folders') {
//         acc.folders = _.concat(acc.folders, value.map(f => f.folder_id));
//         const nestedItems = value.map(getAllIdsFromTree);

//         if (!_.isEmpty(nestedItems)) {
//           nestedItems.forEach(item => {
//             acc.folders = _.concat(acc.folders, item.folders);
//             acc.files = _.concat(acc.files, item.files);
//           });
//         }
//       }
//       return acc;
//     },
//     { files: [], folders: [] }
//   );

// const updateCurrentSettings = (state, action, newState) => {
//   const { subscriberUserId, source } = action.payload;
//   const currentSettings = state.sharingSettings[subscriberUserId] || {};
//   const currentSourceSettings = currentSettings[source] || {};

//   return {
//     ...state.sharingSettings,
//     [subscriberUserId]: {
//       ...currentSettings,
//       [source]: {
//         ...currentSourceSettings,
//         ...newState
//       }
//     }
//   };
// };

const byOrg = (state = {}, action) => {
  switch (action.type) {
    case INTEGRATIONS_FETCH_SUCCESS: {
      const { integrations = [] } = action.payload;
      return {
        ...state,
        ...integrations.reduce((acc, orgIntegrations) => {
          acc[orgIntegrations.subscriberOrgId] = _.omit(orgIntegrations, 'subscriberOrgId');
          return acc;
        }, {})
      };
    }
    case INTEGRATIONS_UPDATE: {
      const { subscriberOrgId, integrations } = action.payload;
      return {
        ...state,
        [subscriberOrgId]: integrations
      };
    }
    case INTEGRATIONS_REVOKE_SUCCESS: {
      if (action.error) return state;

      const { subscriberOrgId, type } = action.payload;
      const orgIntegrations = state[subscriberOrgId] || {};
      return {
        ...state,
        [subscriberOrgId]: {
          ...orgIntegrations,
          [type]: { revoked: true }
        }
      };
    }
    default:
      return state;
  }
};

const byTeam = (state = {}, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const content = (state = { isFetching: false, error: null }, action) => {
  switch (action.type) {
    case INTEGRATIONS_FETCH_CONTENT_REQUEST: {
      return {
        ...state,
        isFetching: true,
        error: null
      };
    }
    case INTEGRATIONS_FETCH_CONTENT_SUCCESS: {
      const {
        files,
        folders,
        source,
        habla_user_id: hablaUserId,
        subscriber_user_id: subscriberUserId,
        subscriber_org_id: orgId
      } = action.payload.content;
      return {
        files,
        folders,
        source,
        hablaUserId,
        subscriberUserId,
        orgId,
        isFetching: false,
        error: null
      };
    }
    case INTEGRATIONS_FETCH_CONTENT_FAILURE: {
      return {
        ...state,
        isFetching: false,
        error: action.payload.error
      };
    }
    default:
      return state;
  }
};

const sharingSettings = (state = {}, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

// const oldIntegrationsReducer = (state = INITIAL_STATE, action) => {
//   switch (action.type) {
//     case TEAM_INTEGRATIONS_FETCH_SUCCESS: {
//       const byTeam = action.payload.teamMemberIntegrations.reduce(
//         (acc, current) => {
//           acc[current.teamId] = {
//             ...acc[current.teamId],
//             [current.userId]: current.integrations
//           };
//           return acc;
//         },
//         { ...state.byTeam }
//       );
//       return {
//         ...state,
//         byTeam
//       };
//     }
//     case SHARING_SETTINGS_TOGGLE: {
//       const { subscriberUserId, source, folderId, fileId } = action.payload;
//       const currentSettings = state.sharingSettings[subscriberUserId] || {};
//       const { folders, files } = currentSettings[source] || {};

//       const sharingSettings = {
//         ...state.sharingSettings,
//         [subscriberUserId]: {
//           ...currentSettings,
//           [source]: {
//             folders: folderId ? _.xor(folders, [folderId]) : folders,
//             files: fileId ? _.xor(files, [fileId]) : files
//           }
//         }
//       };
//       return { ...state, sharingSettings };
//     }
//     case SHARING_SETTINGS_TOGGLE_ALL: {
//       const { subscriberUserId, source } = action.payload;
//       const integrationDetails = getOrgIntegrationContent(state, { source, subscriberUserId });
//       const currentSubscriberSettings = state.sharingSettings[subscriberUserId] || {};
//       const { folders, files } = currentSubscriberSettings[source] || {};
//       const allEmpty = _.isEmpty(folders) && _.isEmpty(files);
//       const settings = allEmpty ? getAllIdsFromTree(integrationDetails) : { folders: [], files: [] };

//       const sharingSettings = {
//         ...state.sharingSettings,
//         [subscriberUserId]: {
//           ...currentSubscriberSettings,
//           [source]: settings
//         }
//       };
//       return { ...state, sharingSettings };
//     }
//     case SHARING_SETTINGS_SAVE_REQUEST:
//       return {
//         ...state,
//         sharingSettings: updateCurrentSettings(state, action, { submitting: true, saved: false })
//       };
//     case SHARING_SETTINGS_SAVE_SUCCESS:
//       return {
//         ...state,
//         sharingSettings: updateCurrentSettings(state, action, { submitting: false, saved: true })
//       };
//     case SHARING_SETTINGS_SAVE_FAILURE:
//       return {
//         ...state,
//         sharingSettings: updateCurrentSettings(state, action, { submitting: false, saved: false })
//       };
//     default:
//       return state;
//   }
// };

const integrationsReducer = combineReducers({
  byOrg,
  byTeam,
  content,
  sharingSettings
});

export default integrationsReducer;
