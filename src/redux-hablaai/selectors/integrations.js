import { createSelector } from 'reselect';
import { flatten } from 'lodash';

export const getIntegrationsByOrg = state => state.integrations.byOrg;
export const getIntegrationsByTeam = state => state.integrations.byTeam;
const getIntegrationContent = state => state.integrations.content;

export const getOrgIntegrationsObj = createSelector(
  [getIntegrationsByOrg, (state, orgId) => orgId],
  (integrationsByOrg, orgId) => {
    const integrations = integrationsByOrg[orgId];
    return integrations || {};
  }
);

export const getOrgIntegrations = createSelector(
  [getIntegrationsByOrg, (state, orgId) => orgId],
  (integrationsByOrg, orgId) =>
    Object.entries(integrationsByOrg[orgId] || {})
      .map(([key, integration]) => ({ ...integration, key }))
      .filter(integration => !integration.revoked)
);

export const getTeamIntegrations = createSelector(
  [getIntegrationsByTeam, (state, teamId) => teamId],
  (integrationsByTeam, teamId) =>
    flatten(
      Object.entries(integrationsByTeam[teamId] || {}).map(([userId, value]) =>
        Object.entries(value).map(([key, integration]) => ({ ...integration, key, userId }))
      )
    ).filter(integration => !integration.revoked)
);

export const getOrgIntegration = createSelector(
  [getIntegrationsByOrg, (state, props) => props],
  (integrations, { source, orgId }) => {
    const integration = integrations[orgId];
    return integration ? integration[source] : null;
  }
);

export const getTeamIntegration = createSelector(
  [getIntegrationsByTeam, (state, props) => props],
  (integrations, { source, teamId }) => {
    const integration = integrations[teamId];
    return integration ? integration[source] : null;
  }
);

export const getOrgIntegrationContent = createSelector(
  [getIntegrationContent, (state, props) => props],
  (content, { source, subscriberUserId }) =>
    content.subscriberUserId === subscriberUserId && content.source === source ? content : {}
);
export const isContentFetching = createSelector([getIntegrationContent], content => content.isFetching);
export const getContentError = createSelector([getIntegrationContent], content => content.error);

export const getSharingSettings = createSelector(
  [state => state.integrations.sharingSettings, (state, props) => props],
  (sharingSettings, { source, subscriberUserId }) => {
    const settings = sharingSettings[subscriberUserId];
    return settings && settings[source] ? settings[source] : {};
  }
);
