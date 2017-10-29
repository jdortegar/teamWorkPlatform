import { createSelector } from 'reselect'; // eslint-disable-line no-unused-vars
import createCachedSelector from 're-reselect';

export * from '../redux-hablaai/selectors';

// ------- Directly from state. START
const getIntegrationsBySubscriberOrgId = state => state.integrations.integrationsBySubscriberOrgId;
// ------- Directly from state. END


export const getIntegrationsOfSubscriberOrgId = createCachedSelector( // eslint-disable-line import/prefer-default-export
  [getIntegrationsBySubscriberOrgId, (state, subscriberOrgId) => subscriberOrgId],
  (integrationsBySubscriberOrgId, subscriberOrgId) => {
    const integrations = integrationsBySubscriberOrgId[subscriberOrgId];
    return integrations || {};
  }
)(
  (state, subscriberOrgId) => subscriberOrgId
);
