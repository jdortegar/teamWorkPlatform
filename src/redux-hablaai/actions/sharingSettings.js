import { buildKnowledgeApiUrl } from 'src/lib/api';
import { getAllIdsFromTree } from 'src/utils/integrationContent';
import { getOrgIntegrationContent } from 'src/selectors';
import { doAuthenticatedRequest } from './urlRequest';

export const SHARING_SETTINGS_TOGGLE = 'sharingSettings/toggle';
export const SHARING_SETTINGS_TOGGLE_ALL = 'sharingSettings/toggleAll';
export const SHARING_SETTINGS_SAVE_REQUEST = 'sharingSettings/save/request';
export const SHARING_SETTINGS_SAVE_SUCCESS = 'sharingSettings/save/success';
export const SHARING_SETTINGS_SAVE_FAILURE = 'sharingSettings/save/failure';

export const toggleSharingSettings = (subscriberUserId, source, { folders, files }) => ({
  type: SHARING_SETTINGS_TOGGLE,
  payload: { subscriberUserId, source, folders, files }
});

export const toggleAllSharingSettings = (subscriberUserId, source, { selectAll }) => (dispatch, getState) => {
  const content = selectAll ? getOrgIntegrationContent(getState(), { subscriberUserId, source }) : {};
  const { folders, files } = getAllIdsFromTree(content);

  return dispatch({
    type: SHARING_SETTINGS_TOGGLE_ALL,
    payload: { subscriberUserId, source, folders, files }
  });
};

export const saveSharingSettings = (source, subscriberUserId, { folders, files }) => {
  const requestUrl = buildKnowledgeApiUrl(`service/${source}/${subscriberUserId}/ingest`);
  const reduxState = { source, subscriberUserId };

  return (dispatch, getState) => {
    dispatch({
      type: SHARING_SETTINGS_SAVE_REQUEST,
      payload: { source, subscriberUserId }
    });

    const { orgId, hablaUserId } = getOrgIntegrationContent(getState(), { subscriberUserId, source });
    const data = {
      subscriber_org_id: orgId,
      subscriber_user_id: subscriberUserId,
      habla_user_id: hablaUserId,
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
