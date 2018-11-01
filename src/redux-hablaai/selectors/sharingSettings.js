import { createSelector } from 'reselect';
import { getCurrentSubscriberUserId } from './subscribers';

export const getSharingSettingsByOrg = state => state.sharingSettings.byOrg;

export const getOrgSharingSettings = createSelector(
  [getSharingSettingsByOrg, getCurrentSubscriberUserId, (state, props) => props],
  (settingsByOrg, subscriberUserId, { source }) => {
    const orgSettings = settingsByOrg[subscriberUserId] || {};
    return orgSettings[source] || {};
  }
);
