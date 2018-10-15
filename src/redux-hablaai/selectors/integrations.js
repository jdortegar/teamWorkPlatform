import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import { getIntegrationsBySubscriberOrgId } from './state';

export { getIntegrationsBySubscriberOrgId } from './state';

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
    return settings ? settings[source] : {};
  }
);
