import { createSelector } from 'reselect';
import { flatten } from 'lodash';
import createCachedSelector from 're-reselect';
import { getIntegrationsBySubscriberOrgId, getIntegrationsByTeamId } from './state';

export { getIntegrationsBySubscriberOrgId, getIntegrationsByTeamId } from './state';

export const getIntegrationsOfSubscriberOrgId = createCachedSelector(
  [getIntegrationsBySubscriberOrgId, (state, subscriberOrgId) => subscriberOrgId],
  (integrationsBySubscriberOrgId, subscriberOrgId) => {
    const integrations = integrationsBySubscriberOrgId[subscriberOrgId];
    return integrations || {};
  }
)((state, subscriberOrgId) => subscriberOrgId);

export const getIntegration = createSelector(
  [getIntegrationsBySubscriberOrgId, (state, props) => props],
  (integrations, { source, subscriberOrgId }) => {
    const integration = integrations[subscriberOrgId];
    return integration ? integration[source] : null;
  }
);

const getIntegrationDetailsBySubscriberUserId = state =>
  state.integrationDetailsBySubscriberUserId || state.integrations.integrationDetailsBySubscriberUserId;

export const getIntegrationDetails = createSelector(
  [getIntegrationDetailsBySubscriberUserId, (state, props) => props],
  (integrations, { source, subscriberUserId }) => {
    const integration = integrations[subscriberUserId];
    return integration ? integration[source] : null;
  }
);

export const getSharingSettings = createSelector(
  [state => state.integrations.sharingSettings, (state, props) => props],
  (sharingSettings, { source, subscriberUserId }) => {
    const settings = sharingSettings[subscriberUserId];
    return settings && settings[source] ? settings[source] : {};
  }
);

export const getTeamIntegrations = createCachedSelector(
  [getIntegrationsByTeamId, (state, teamId) => teamId],
  (integrationsByTeamId, teamId) => {
    const integrationsByUser = Object.entries(integrationsByTeamId[teamId] || {});
    const teamIntegrations = integrationsByUser.map(([userId, value]) =>
      Object.entries(value).map(([key, integration]) => ({ ...integration, key, userId }))
    );
    return flatten(teamIntegrations).filter(team => !team.revoked);
  }
)((state, teamId) => teamId);
