import { createSelector } from 'reselect';

export const getSharingSettingsData = createSelector(
  [state => state.sharingSettings.data, (state, props) => props],
  (sharingSettings, { source, subscriberUserId }) => (sharingSettings[subscriberUserId] || {})[source] || {}
);

export const getSharingSettingsUi = createSelector(
  [state => state.sharingSettings.ui, (state, props) => props],
  (sharingSettings, { source, subscriberUserId }) => (sharingSettings[subscriberUserId] || {})[source] || {}
);
