import _ from 'lodash';
import {
  INTEGRATIONS_FETCH_SUCCESS,
  INTEGRATIONS_FETCH_DETAILS_SUCCESS,
  INTEGRATIONS_REVOKE_SUCCESS,
  INTEGRATIONS_UPDATE,
  TEAM_INTEGRATIONS_FETCH_SUCCESS,
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
  integrationsByTeamId: {},
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

// const fakeData = {
//   teamMemberIntegrations: [
//     {
//       integrations: {
//         box: {
//           acquiredAtMS: 1534868020463,
//           expired: false,
//           userId: '3547876026',
//           accessTokenTTLMS: 4186000
//         },
//         dropbox: {
//           revoked: true
//         }
//       },
//       teamId: 'b17f145f-64e9-44d0-ac19-b98b17b8b1a8',
//       userId: '8237195a-b522-43c3-93e7-28a77f7f9653'
//     },
//     {
//       integrations: {
//         google: {
//           expired: false,
//           expiry_date: 1538062479898,
//           scope:
//             'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.install https://www.googleapis.com/auth/drive.readonly',
//           userId: '101693230268909862812'
//         },
//         salesforce: {
//           access_token:
//             '00Df2000001Gfi6!AR4AQGinlpg27JGilgsk0ICyJu36cpGp1SzXw.PcsM54_i92tMlSwDn6aN.Yejdj2e0DB7FLr3igWwBCsbarTuaGxZdnTE2u',
//           expired: false,
//           id: 'https://login.salesforce.com/id/00Df2000001Gfi6EAC/005f2000008kDZ0AAM',
//           id_token: 'eyJraWQiOiIyMTQiLCJ0eXAiOiJKV1Q....',
//           instance_url: 'https://na53.salesforce.com',
//           issued_at: '1530818690215',
//           scope: 'full',
//           signature: 'gUbBmZkgAQBzbxDDmXHISS39QS8sjX+Z5VKK2KTc79Y=',
//           token_type: 'Bearer',
//           userId: 'https://login.salesforce.com/id/00Df2000001Gfi6EAC/005f2000008kDZ0AAM'
//         }
//       },
//       teamId: 'b17f145f-64e9-44d0-ac19-b98b17b8b1a8',
//       userId: '8237195a-b522-43c3-93e7-28a77f7f9653'
//     }
//   ]
// };

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
    case TEAM_INTEGRATIONS_FETCH_SUCCESS: {
      const integrationsByTeamId = action.payload.teamMemberIntegrations.reduce(
        (acc, current) => {
          acc[current.teamId] = {
            ...acc[current.teamId],
            [current.userId]: current.integrations
          };
          return acc;
        },
        { ...state.integrationsByTeamId }
      );
      return {
        ...state,
        integrationsByTeamId
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
