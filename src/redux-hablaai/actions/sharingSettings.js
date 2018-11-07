import _ from 'lodash';

import { buildKnowledgeApiUrl } from 'src/lib/api';
import { getAllIdsFromTree, getAllChildrenIds, getAllParentIds } from 'src/utils/integrationContent';
import {
  getOrgSharingSettings,
  getTeamSharingSettings,
  getOrgIntegrationContent,
  getTeamIntegrationContent
} from 'src/selectors';
import { doAuthenticatedRequest } from './urlRequest';

export const SHARING_SETTINGS_TOGGLE = 'sharingSettings/toggle';
export const SHARING_SETTINGS_TOGGLE_ALL = 'sharingSettings/toggleAll';
export const SHARING_SETTINGS_SAVE_REQUEST = 'sharingSettings/save/request';
export const SHARING_SETTINGS_SAVE_SUCCESS = 'sharingSettings/save/success';
export const SHARING_SETTINGS_SAVE_FAILURE = 'sharingSettings/save/failure';
export const TEAM_SHARING_SETTINGS_TOGGLE = 'teamSharingSettings/toggle';
export const TEAM_SHARING_SETTINGS_TOGGLE_ALL = 'teamSharingSettings/toggleAll';
export const TEAM_SHARING_SETTINGS_SAVE_REQUEST = 'sharingSettings/save/request';
export const TEAM_SHARING_SETTINGS_SAVE_SUCCESS = 'sharingSettings/save/success';
export const TEAM_SHARING_SETTINGS_SAVE_FAILURE = 'sharingSettings/save/failure';

const toggleFoldersAndFiles = (content, settings, { folderId, fileId }) => {
  // toggle file selection, keep folder selection
  if (fileId) {
    return {
      files: _.xor(settings.files, [fileId]),
      folders: settings.folders
    };
  }

  if (folderId) {
    const children = getAllChildrenIds(content, folderId);
    if (!_.includes(settings.folders, folderId)) {
      // select a folder and its children
      return {
        folders: _.concat(settings.folders || [], children.folders),
        files: _.concat(settings.files || [], children.files)
      };
    }

    // deselect a folder and its children
    return {
      folders: _.without(settings.folders, ...children.folders),
      files: _.without(settings.files, ...children.files)
    };
  }

  return {};
};

export const toggleOrgSharingSettings = (subscriberUserId, source, { folderId, fileId }) => (dispatch, getState) => {
  const state = getState();
  const settings = getOrgSharingSettings(state, { source });
  const content = getOrgIntegrationContent(state, { subscriberUserId, source });
  const data = toggleFoldersAndFiles(content, settings, { folderId, fileId });

  return dispatch({
    type: SHARING_SETTINGS_TOGGLE,
    payload: { subscriberUserId, source, ...data }
  });
};

export const toggleTeamSharingSettings = (subscriberUserId, source, teamId, { folderId, fileId }) => (
  dispatch,
  getState
) => {
  const state = getState();
  const settings = getTeamSharingSettings(state, { source, teamId });
  const content = getTeamIntegrationContent(state, { subscriberUserId, teamId, source });
  const data = toggleFoldersAndFiles(content, settings, { folderId, fileId });

  return dispatch({
    type: TEAM_SHARING_SETTINGS_TOGGLE,
    payload: { subscriberUserId, teamId, source, ...data }
  });
};

export const toggleAllOrgSharingSettings = (subscriberUserId, source, { selectAll }) => (dispatch, getState) => {
  const content = selectAll ? getOrgIntegrationContent(getState(), { subscriberUserId, source }) : {};
  const { folders, files } = getAllIdsFromTree(content);

  return dispatch({
    type: SHARING_SETTINGS_TOGGLE_ALL,
    payload: { subscriberUserId, source, folders, files }
  });
};

export const toggleAllTeamSharingSettings = (subscriberUserId, source, teamId, { selectAll }) => (
  dispatch,
  getState
) => {
  const content = selectAll ? getOrgIntegrationContent(getState(), { subscriberUserId, teamId, source }) : {};
  const { folders, files } = getAllIdsFromTree(content);

  return dispatch({
    type: TEAM_SHARING_SETTINGS_TOGGLE_ALL,
    payload: { subscriberUserId, teamId, source, folders, files }
  });
};

export const saveOrgSharingSettings = (source, subscriberUserId) => (dispatch, getState) => {
  const requestUrl = buildKnowledgeApiUrl(`service/${source}/${subscriberUserId}/ingest`);

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
      { source, subscriberUserId }
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

export const saveTeamSharingSettings = (source, subscriberUserId, teamId) => (dispatch, getState) => {
  const requestUrl = buildKnowledgeApiUrl(`service/${source}/${subscriberUserId}/ingest`);

  dispatch({
    type: TEAM_SHARING_SETTINGS_SAVE_REQUEST,
    payload: { source, subscriberUserId, teamId }
  });

  const state = getState();
  const content = getTeamIntegrationContent(state, { subscriberUserId, source, teamId });
  const settings = getTeamSharingSettings(state, { source, teamId });
  const { folders, files } = getAllParentIds(content, settings.folders, settings.files);

  const data = {
    subscriber_user_id: subscriberUserId,
    subscriber_org_id: content.orgId,
    habla_user_id: content.hablaUserId,
    subscriber_team_id: teamId,
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
      { source, subscriberUserId, teamId }
    )
  );

  thunk
    .then(() =>
      dispatch({
        type: TEAM_SHARING_SETTINGS_SAVE_SUCCESS,
        payload: { source, subscriberUserId, teamId }
      })
    )
    .catch(() =>
      dispatch({
        type: TEAM_SHARING_SETTINGS_SAVE_FAILURE,
        payload: { source, subscriberUserId, teamId }
      })
    );

  return thunk;
};
