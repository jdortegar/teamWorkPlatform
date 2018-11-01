import { createSelector } from 'reselect';
import { flatten } from 'lodash';

import { getCurrentUserId } from './auth';

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

// returns an array with all integrations of an org
export const getOrgIntegrations = createSelector(
  [getIntegrationsByOrg, (state, orgId) => orgId],
  (integrationsByOrg, orgId) =>
    Object.entries(integrationsByOrg[orgId] || {})
      .map(([source, integration]) => ({ ...integration, source }))
      .filter(integration => !integration.revoked)
);

// returns an array with all integrations of a team
export const getTeamIntegrations = createSelector(
  [getIntegrationsByTeam, (state, teamId) => teamId],
  (integrationsByTeam, teamId) => {
    const teamIntegrations = integrationsByTeam[teamId] || {};
    const integrations = Object.entries(teamIntegrations).map(([userId, userIntegrations]) =>
      Object.entries(userIntegrations).map(([source, integration]) => ({ ...integration, source, teamId, userId }))
    );
    return flatten(integrations).filter(integration => !integration.revoked);
  }
);

// returns an array with only the current user's integrations of a team
export const getUserTeamIntegrations = createSelector(
  [getIntegrationsByTeam, getCurrentUserId, (state, teamId) => teamId],
  (integrationsByTeam, userId, teamId) => {
    const teamIntegrations = integrationsByTeam[teamId] || {};
    return Object.entries(teamIntegrations[userId] || {})
      .map(([source, integration]) => ({ ...integration, source, teamId, userId }))
      .filter(integration => !integration.revoked);
  }
);

// returns a specific integration of an org
export const getOrgIntegration = createSelector(
  [getIntegrationsByOrg, (state, props) => props],
  (integrationsByOrg, { source, orgId }) => {
    const integrations = integrationsByOrg[orgId] || {};
    const integration = integrations[source];
    return integration ? { ...integration, source } : null;
  }
);

// returns a specific team integration from the current user
export const getTeamIntegration = createSelector(
  [getIntegrationsByTeam, getCurrentUserId, (state, props) => props],
  (integrationsByTeam, userId, { source, teamId }) => {
    const teamIntegrations = integrationsByTeam[teamId] || {};
    const userIntegrations = teamIntegrations[userId] || {};
    const integration = userIntegrations[source];
    return integration ? { ...integration, source, teamId, userId } : null;
  }
);

// integration content and sharing settings
export const getOrgIntegrationContent = createSelector(
  [getIntegrationContent, (state, props) => props],
  (content, { source, subscriberUserId }) =>
    content.subscriberUserId === subscriberUserId && content.source === source ? content : {}
);
export const isContentFetching = createSelector([getIntegrationContent], content => content.isFetching);
export const getContentError = createSelector([getIntegrationContent], content => content.error);
