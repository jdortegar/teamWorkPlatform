import createCachedSelector from 're-reselect';
import { getIntegrationsBySubscriberOrgId } from './state';

export { getIntegrationsBySubscriberOrgId } from './state';

export const getIntegrationsOfSubscriberOrgId = createCachedSelector(
  [getIntegrationsBySubscriberOrgId, (state, subscriberOrgId) => subscriberOrgId],
  (integrationsBySubscriberOrgId, subscriberOrgId) => {
    const integrations = integrationsBySubscriberOrgId[subscriberOrgId];
    return integrations || {};
  }
)(
  (state, subscriberOrgId) => subscriberOrgId
);
