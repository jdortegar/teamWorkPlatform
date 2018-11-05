import _ from 'lodash';

import { buildKnowledgeApiUrl } from 'src/lib/api';
import { getAllIdsFromTree, getAllChildrenIds, getAllParentIds } from 'src/utils/integrationContent';
import { getOrgSharingSettings, getOrgIntegrationContent } from 'src/selectors';
import { doAuthenticatedRequest } from './urlRequest';

export const SHARING_SETTINGS_TOGGLE = 'sharingSettings/toggle';
export const SHARING_SETTINGS_TOGGLE_ALL = 'sharingSettings/toggleAll';
export const SHARING_SETTINGS_SAVE_REQUEST = 'sharingSettings/save/request';
export const SHARING_SETTINGS_SAVE_SUCCESS = 'sharingSettings/save/success';
export const SHARING_SETTINGS_SAVE_FAILURE = 'sharingSettings/save/failure';

export const toggleSharingSettings = (subscriberUserId, source, { folderId, fileId }) => (dispatch, getState) => {
  const state = getState();
  const settings = getOrgSharingSettings(state, { source });
  const content = getOrgIntegrationContent(state, { subscriberUserId, source });
  const result = {};

  // toggle file selection, keep folder selection
  if (fileId) {
    result.files = _.xor(settings.files, [fileId]);
    result.folders = settings.folders;
  }

  if (folderId) {
    const children = getAllChildrenIds(content, folderId);
    if (!_.includes(settings.folders, folderId)) {
      // select a folder and its children
      result.folders = _.concat(settings.folders || [], children.folders);
      result.files = _.concat(settings.files || [], children.files);
    } else {
      // deselect a folder and its children
      result.folders = _.without(settings.folders, ...children.folders);
      result.files = _.without(settings.files, ...children.files);
    }
  }

  return dispatch({
    type: SHARING_SETTINGS_TOGGLE,
    payload: { subscriberUserId, source, ...result }
  });
};

export const toggleAllSharingSettings = (subscriberUserId, source, { selectAll }) => (dispatch, getState) => {
  const content = selectAll ? getOrgIntegrationContent(getState(), { subscriberUserId, source }) : {};
  const { folders, files } = getAllIdsFromTree(content);

  return dispatch({
    type: SHARING_SETTINGS_TOGGLE_ALL,
    payload: { subscriberUserId, source, folders, files }
  });
};

export const saveSharingSettings = (source, subscriberUserId) => {
  const requestUrl = buildKnowledgeApiUrl(`service/${source}/${subscriberUserId}/ingest`);
  const reduxState = { source, subscriberUserId };

  return (dispatch, getState) => {
    dispatch({
      type: SHARING_SETTINGS_SAVE_REQUEST,
      payload: { source, subscriberUserId }
    });

    const state = getState();
    const content = getOrgIntegrationContent(state, { subscriberUserId, source });
    const settings = getOrgSharingSettings(state, { source });
    const { folders, files } = getAllParentIds(content, settings.folders, settings.files);

    const data = {
      subscriber_user_id: subscriberUserId,
      subscriber_org_id: content.orgId,
      habla_user_id: content.hablaUserId,
      subscriber_team_id: null,
      source,
      folders,
      files
    };

    const thunk = dispatch(
      doAuthenticatedRequest(
        {
          requestUrl,
          method: 'post',
          data
        },
        reduxState
      )
    );

    thunk
      .then(() =>
        dispatch({
          type: SHARING_SETTINGS_SAVE_SUCCESS,
          payload: { source, subscriberUserId }
        })
      )
      .catch(() =>
        dispatch({
          type: SHARING_SETTINGS_SAVE_FAILURE,
          payload: { source, subscriberUserId }
        })
      );

    return thunk;
  };
};
