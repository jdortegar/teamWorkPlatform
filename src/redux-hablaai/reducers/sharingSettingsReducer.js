import { combineReducers } from 'redux';
import _ from 'lodash';

import {
  SHARING_SETTINGS_TOGGLE,
  SHARING_SETTINGS_TOGGLE_ALL,
  SHARING_SETTINGS_SAVE_REQUEST,
  SHARING_SETTINGS_SAVE_SUCCESS,
  SHARING_SETTINGS_SAVE_FAILURE
} from 'src/actions';

const ui = (state = { saved: false, submitting: false }, action) => {
  switch (action.type) {
    case SHARING_SETTINGS_SAVE_REQUEST:
      return {
        ...state,
        submitting: true,
        saved: false
      };
    case SHARING_SETTINGS_SAVE_SUCCESS:
      return {
        ...state,
        submitting: false,
        saved: true
      };
    case SHARING_SETTINGS_SAVE_FAILURE:
      return {
        ...state,
        submitting: false,
        saved: false
      };
    default:
      return state;
  }
};

const data = (state = {}, action) => {
  switch (action.type) {
    case SHARING_SETTINGS_TOGGLE: {
      // TODO: select all parent folders of a selected folder/file
      const { subscriberUserId, source, folderId, fileId } = action.payload;
      const currentSettings = state[subscriberUserId] || {};
      const { folders, files } = currentSettings[source] || {};

      return {
        ...state,
        [subscriberUserId]: {
          ...currentSettings,
          [source]: {
            folders: folderId ? _.xor(folders, [folderId]) : folders,
            files: fileId ? _.xor(files, [fileId]) : files
          }
        }
      };
    }
    case SHARING_SETTINGS_TOGGLE_ALL: {
      // TODO: not working yet
      const { subscriberUserId, source, selectAll } = action.payload;

      return {
        ...state,
        [subscriberUserId]: {
          ...state[subscriberUserId],
          [source]: {
            folders: selectAll ? [] : [],
            files: selectAll ? [] : []
          }
        }
      };
    }
    default:
      return state;
  }
};

export default combineReducers({ ui, data });

// const oldIntegrationsReducer = (state = INITIAL_STATE, action) => {
//   switch (action.type) {
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
//     default:
//       return state;
//   }
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
