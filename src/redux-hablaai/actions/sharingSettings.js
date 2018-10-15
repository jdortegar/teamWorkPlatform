import { buildKnowledgeApiUrl } from 'src/lib/api';
import { getIntegrationDetails } from 'src/selectors';
import { doAuthenticatedRequest } from './urlRequest';

export const SHARING_SETTINGS_TOGGLE = 'sharingSettings/toggle';
export const SHARING_SETTINGS_TOGGLE_ALL = 'sharingSettings/toggleAll';
export const SHARING_SETTINGS_SAVE_REQUEST = 'sharingSettings/save/request';
export const SHARING_SETTINGS_SAVE_SUCCESS = 'sharingSettings/save/success';
export const SHARING_SETTINGS_SAVE_FAILURE = 'sharingSettings/save/failure';

export const toggleSharingSettings = (subscriberUserId, source, { folderId, fileId }) => ({
  type: SHARING_SETTINGS_TOGGLE,
  payload: { subscriberUserId, source, folderId, fileId }
});

export const toggleAllSharingSettings = (subscriberUserId, source) => ({
  type: SHARING_SETTINGS_TOGGLE_ALL,
  payload: { subscriberUserId, source }
});

export const saveSharingSettings = (source, subscriberUserId, { folders, files }) => {
  const requestUrl = buildKnowledgeApiUrl(`service/${source}/${subscriberUserId}/ingest`);
  const reduxState = { source, subscriberUserId };

  return (dispatch, getState) => {
    dispatch({
      type: SHARING_SETTINGS_SAVE_REQUEST,
      payload: { source, subscriberUserId }
    });

    const integrationDetails = getIntegrationDetails(getState(), { source, subscriberUserId });
    const data = {
      subscriber_org_id: integrationDetails.subscriber_org_id,
      subscriber_user_id: subscriberUserId,
      habla_user_id: integrationDetails.habla_user_id,
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
