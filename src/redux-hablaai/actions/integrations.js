export const INTEGRATION_ERROR = 'integration/error';
export const INTEGRATION_ERROR_BADSUBSCRIBERORG = 'integration/error/badsubscriberorg';

export const INTEGRATIONS_UPDATE = 'integrations/update';

export const updateIntegrations = (userId, subscriberOrgId, integrations) => ({
  type: INTEGRATIONS_UPDATE,
  payload: { userId, subscriberOrgId, integrations }
});
