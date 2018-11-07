import { createSelector } from 'reselect';
import { getCurrentSubscriberUserId } from './subscribers';

export const getSharingSettingsByOrg = state => state.sharingSettings.byOrg;
export const getSharingSettingsByTeam = state => state.sharingSettings.byTeam;

export const getOrgSharingSettings = createSelector(
  [getSharingSettingsByOrg, getCurrentSubscriberUserId, (state, props) => props],
  (settingsByOrg, subscriberUserId, { source }) => {
    const orgSettings = settingsByOrg[subscriberUserId] || {};
    return orgSettings[source] || {};
  }
);

export const getTeamSharingSettings = createSelector(
  [getSharingSettingsByTeam, (state, props) => props],
  (settingsByOrg, { source, teamId }) => {
    const teamSettings = settingsByOrg[teamId] || {};
    return teamSettings[source] || {};
  }
);
