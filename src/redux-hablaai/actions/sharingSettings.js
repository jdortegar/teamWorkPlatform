import _ from 'lodash';

import { buildKnowledgeApiUrl } from 'src/lib/api';
import {
  getAllIdsFromTree,
  getAllChildrenIds,
  getAllParentIds,
  getAllIdsFromSites
} from 'src/utils/integrationContent';
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

// toggle folders and files of a sharepoint site
const toggleSiteSettings = (content, settings, site, data) => {
  const { sites = {} } = settings;
  const currentSite = sites[site] || {};
  const siteContent = content[site] || {};

  return {
    ...settings,
    sites: {
      ...settings.sites,
      [site]: toggleFoldersAndFiles(siteContent, currentSite, data)
    }
  };
};

export const toggleOrgSharingSettings = (subscriberUserId, source, { folderId, fileId, site }) => (
  dispatch,
  getState
) => {
  const state = getState();
  const content = getOrgIntegrationContent(state, { subscriberUserId, source });
  const settings = getOrgSharingSettings(state, { source });
  let data = {};

  if (site) {
    data = toggleSiteSettings(content, settings, site, { folderId, fileId });
  } else {
    data = toggleFoldersAndFiles(content, settings, { folderId, fileId });
  }

  return dispatch({
    type: SHARING_SETTINGS_TOGGLE,
    payload: { subscriberUserId, source, ...data }
  });
};

export const toggleTeamSharingSettings = (subscriberUserId, source, teamId, { folderId, fileId, site }) => (
  dispatch,
  getState
) => {
  const state = getState();
  const settings = getTeamSharingSettings(state, { source, teamId });
  const content = getTeamIntegrationContent(state, { subscriberUserId, teamId, source });
  let data = {};

  if (site) {
    data = toggleSiteSettings(content, settings, site, { folderId, fileId });
  } else {
    data = toggleFoldersAndFiles(content, settings, { folderId, fileId });
  }

  return dispatch({
    type: TEAM_SHARING_SETTINGS_TOGGLE,
    payload: { subscriberUserId, teamId, source, ...data }
  });
};

export const toggleAllOrgSharingSettings = (subscriberUserId, source, { selectAll }) => (dispatch, getState) => {
  const content = selectAll ? getOrgIntegrationContent(getState(), { subscriberUserId, source }) : {};
  let data = {};

  if (content.sites) {
    data = getAllIdsFromSites(content);
  } else {
    data = getAllIdsFromTree(content);
  }

  return dispatch({
    type: SHARING_SETTINGS_TOGGLE_ALL,
    payload: { subscriberUserId, source, ...data }
  });
};

export const toggleAllTeamSharingSettings = (subscriberUserId, source, teamId, { selectAll }) => (
  dispatch,
  getState
) => {
  const content = selectAll ? getTeamIntegrationContent(getState(), { subscriberUserId, teamId, source }) : {};
  let data = {};

  if (content.sites) {
    data = getAllIdsFromSites(content);
  } else {
    data = getAllIdsFromTree(content);
  }

  return dispatch({
    type: TEAM_SHARING_SETTINGS_TOGGLE_ALL,
    payload: { subscriberUserId, teamId, source, ...data }
  });
};

const buildSitesPayload = (content, sites = {}) => ({
  sites: _.keys(sites),
  ..._.reduce(
    sites,
    (acc, value = {}, key) => {
      acc[key] = getAllParentIds(content[key], value.folders, value.files);
      return acc;
    },
    {}
  )
});

export const saveOrgSharingSettings = (source, subscriberUserId) => (dispatch, getState) => {
  const requestUrl = buildKnowledgeApiUrl(`service/${source}/${subscriberUserId}/ingest`);

  dispatch({
    type: SHARING_SETTINGS_SAVE_REQUEST,
    payload: { source, subscriberUserId }
  });

  const state = getState();
  const content = getOrgIntegrationContent(state, { subscriberUserId, source });
  const settings = getOrgSharingSettings(state, { source });
  let data = {};

  if (settings.sites) {
    data = buildSitesPayload(content, settings.sites);
  } else {
    data = getAllParentIds(content, settings.folders, settings.files);
  }

  const payload = {
    subscriber_user_id: subscriberUserId,
    subscriber_org_id: content.orgId,
    habla_user_id: content.hablaUserId,
    team_id: null,
    source,
    ...data
  };

  const thunk = dispatch(
    doAuthenticatedRequest(
      {
        requestUrl,
        method: 'post',
        data: payload
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
  let data = {};

  if (settings.sites) {
    data = buildSitesPayload(content, settings.sites);
  } else {
    data = getAllParentIds(content, settings.folders, settings.files);
  }

  const payload = {
    subscriber_user_id: subscriberUserId,
    subscriber_org_id: content.orgId,
    habla_user_id: content.hablaUserId,
    team_id: teamId,
    source,
    ...data
  };

  const thunk = dispatch(
    doAuthenticatedRequest(
      {
        requestUrl,
        method: 'post',
        data: payload
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
